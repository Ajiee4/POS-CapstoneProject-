using Humanizer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;
using POS_CapstoneProject_.DTO;

namespace POS_CapstoneProject_.Controllers.Admin
{
    public class SalesReportMenuController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;
        public SalesReportMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var UserId = HttpContext.Session.GetInt32("UserID");
            if (UserId != null)
            {
                var check = _context.User.Where(s => s.UserId == UserId).FirstOrDefault();
                if (check != null)
                {
                    if (check.RoleId != 1)
                    {
                        //HttpContext.Session.Clear();
                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {
                   
                        return View();
                    }
                }
                else
                {
                    return RedirectToAction("Login", "Authentication");
                }
            }
            else
            {
                return RedirectToAction("Login", "Authentication");
            }
        }
        [HttpPost]
        public async Task<IActionResult> GenerateReport(string reportType,string inventoryByType, DateTime fromDate, DateTime toDate)
        {
            if(reportType == "Sales Report")
            {
                var salesRep = await _context.Order                             
                                             .Where(s => s.OrderDate >= fromDate && s.OrderDate <= toDate)
                                             .GroupBy(g => new { g.OrderDate })
                                             .Select(g => new SalesReport
                                             {
                                    
                                                 OrderDate = g.Key.OrderDate.ToString(),
                                                 TotalSales = g.Sum(x => x.TotalAmount),
                                    
                                             })                                                   
                                             .ToListAsync();

                var grandTotal = salesRep.Sum(s => s.TotalSales);

                ViewData["GrandTotal"] = grandTotal;
                ViewData["SalesReport"] = JsonConvert.SerializeObject(salesRep);

            }
            else if(reportType == "Inventory Report")
            {
                var ingredientList = await _context.Ingredient.ToListAsync();
                ViewData["InventoryReport"] = JsonConvert.SerializeObject(ingredientList);
              

            }

            return View("Index");
       
        }

    }

}
