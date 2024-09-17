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
                        //HttpContext.Session.Clear();
                        return RedirectToAction("Index", "Sales");
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
        public IActionResult Index(string reportType, string filter)
        {
            if (reportType == "Sales")
            {

                if (filter == "Daily")
                {


                    var Daily = _context.Order
                        .GroupBy(o => o.OrderDate)
                        .Select(g => new SalesReport
                        {
                            Date = g.Key,
                            TotalSales = g.Sum(o => o.TotalAmount)
                        })
                        .OrderBy(g => g.Date)
                        .ToList();

                    var chartData = new
                    {
                        labels = Daily.Select(d => d.Date.ToString("MMMM dd, yyyy")),
                        data = Daily.Select(d => d.TotalSales)
                    };
                    TempData["SalesFilter"] = "Daily Sales";
                    ViewData["Sales"] = chartData;
                }
                else if (filter == "Monthly")
                {
                  
                    var orders = _context.Order.ToList();

                    var monthlySalesData = orders
                        .GroupBy(o => new { Year = o.OrderDate.Year, Month = o.OrderDate.Month })
                        .Select(g => new SalesReport
                        {
                            Date = new DateTime(g.Key.Year, g.Key.Month, 1),
                            TotalSales = g.Sum(o => o.TotalAmount)
                        })
                        .OrderBy(g => g.Date)
                        .ToList();

                    var chartData = new
                    {
                        labels = monthlySalesData.Select(d => d.Date.ToString("MMMM yyyy")),
                        data = monthlySalesData.Select(d => d.TotalSales)
                    };
                    TempData["SalesFilter"] = "Monthly Sales";
                    ViewData["Sales"] = chartData;
                }
                else if (filter == "Yearly")
                {
                    var orders = _context.Order.ToList();

                    var yearlySalesData = orders
                        .GroupBy(o => o.OrderDate.Year)
                        .Select(g => new SalesReport
                        {
                            Date = new DateTime(g.Key, 1, 1), 
                            TotalSales = g.Sum(o => o.TotalAmount)
                        })
                        .OrderBy(g => g.Date)
                        .ToList();

                    var chartData = new
                    {
                        labels = yearlySalesData.Select(d => d.Date.ToString("yyyy")),
                        data = yearlySalesData.Select(d => d.TotalSales)
                    };
                    TempData["SalesFilter"] = "Yearly Sales";
                    ViewData["Sales"] = chartData;
                }
              
            }

            else if (reportType == "Inventory")
            {
                if (filter == "Daily")
                {

                   
                }
            return View();
        }
       
     
    }
}
