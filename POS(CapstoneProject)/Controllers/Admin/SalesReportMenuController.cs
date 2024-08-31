using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

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
                        HttpContext.Session.Clear();
                        return RedirectToAction("Login", "Authentication");
                    }
                    else
                    {


                        //var salesBreakDown = _context.InventoryTransactionDetail.Include(s => s.InventoryTransaction)
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
        public IActionResult Index(string reportType)
        {
            if (reportType == "Sales")
            {
                var dailySalesData = _context.Order
                    .GroupBy(o => o.OrderDate.Date)
                    .Select(g => new SalesReport
                    {
                        Date = g.Key,
                        TotalSales = g.Sum(o => o.TotalAmount)
                    })
                    .OrderBy(g => g.Date)
                    .ToList();

                var chartData = new
                {
                    labels = dailySalesData.Select(d => d.Date.ToString("yyyy-MM-dd")),
                    data = dailySalesData.Select(d => d.TotalSales)
                };

                ViewData["Sales"] = chartData;
              



              
            }
            else if(reportType == "Inventory")
            {

            }

              return View();
        }
       
     
    }
}
