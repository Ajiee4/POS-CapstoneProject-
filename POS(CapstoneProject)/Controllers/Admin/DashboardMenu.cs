using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.DTO;
using System.Globalization;

namespace POS_CapstoneProject_.Controllers.Admin
{
    public class DashboardMenu : Controller
    {

        //db context
        private readonly POS_CapstoneProject_Context _context;

        //constrcutor
        public DashboardMenu(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            //get the session
            var UserId = HttpContext.Session.GetInt32("UserID");

            //check if there's an ongoing session
            if (UserId != null)
            {
                var check = _context.User.Where(s => s.UserId == UserId).FirstOrDefault();
                if (check != null)
                {
                    if (check.RoleId != 1)
                    {
                       
                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {

                        var salesRep =  _context.Order
                                     .Join(_context.OrderDetails, o => o.OrderId, od => od.OrderId, (o, od) => new { o, od })
                                     .Join(_context.Product, o_od => o_od.od.ProductId, p => p.ProductId, (o_od, p) => new { o_od.o, o_od.od, p })
                                     .AsEnumerable()
                                     .Where(x => x.o.OrderDate.Year == DateTime.Now.Year && x.o.OrderDate.Month == DateTime.Now.Month)
                                     .GroupBy(g => new {
                                         g.p.Name,
                                         Month = DateTime.Now.Month
                                     })
                                     .Select(g => new SalesReport
                                     {
                                         Name = g.Key.Name,
                                         OrderDate = CultureInfo.InvariantCulture.DateTimeFormat.GetMonthName(g.Key.Month),
                                         TotalSales = g.Sum(x => x.od.Quantity * x.p.Price),
                                         TotalSold = g.Sum(x => x.od.Quantity)
                                     })
                                     .OrderBy(result => result.OrderDate)
                                     .ThenByDescending(result => result.TotalSold)
                                     .ThenBy(result => result.Name)
                                     .ToList();

                        TempData["SalesReport"] = JsonConvert.SerializeObject(salesRep);


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
    }
}
