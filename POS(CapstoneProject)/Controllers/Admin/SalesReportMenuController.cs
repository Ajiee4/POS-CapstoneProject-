using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;
using System.Configuration;
using System.Globalization;
using System.Linq;
using static POS_CapstoneProject_.Controllers.Admin.SalesReportMenuController;

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
        public class ChartData
        {
            public string[] Labels { get; set; }
            public ChartDataPoint[] Data { get; set; }
        }

        public class ChartDataPoint
        {
            public int TotalStockIn { get; set; }
            public int TotalStockOut { get; set; }
        }
        [HttpPost]
        public async Task<IActionResult>   Index(string reportType, string filter)
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
                    var Daily = await (from it in _context.InventoryTransaction
                                join itd in _context.InventoryTransactionDetail on it.InventoryTransactId equals itd.InventoryTransactId  into gj
                                       from sub in gj.DefaultIfEmpty()
                                group new { it, sub } by it.TransactionDate into g
                                select new InventoryReport
                                {
                                    Date = g.Key,
                                    TotalStockIn = g.Sum(x => x.sub != null && x.it.TransactionType == "Stock In" ? x.sub.Quantity : 0),
                                    TotalStockOut = g.Sum(x => x.sub != null && x.it.TransactionType == "Stock Out" ? x.sub.Quantity : 0),
                                   
                                }).ToListAsync();

                    var chartData = new ChartData
                    {
                        Labels = Daily.Select(d => d.Date.ToString("MMMM dd, yyyy")).ToArray(),
                        Data = Daily.Select(d => new ChartDataPoint { TotalStockIn = d.TotalStockIn, TotalStockOut = d.TotalStockOut }).ToArray()
                    };

                    TempData["SalesFilter"] = "Daily Stock";
                    ViewData["Inventory"] = chartData;
                }
                else if(filter == "Monthly")
{
                    var Monthly = await (from it in _context.InventoryTransaction
                                         join itd in _context.InventoryTransactionDetail on it.InventoryTransactId equals itd.InventoryTransactId into gj
                                         from sub in gj.DefaultIfEmpty()
                                         group new { it, sub } by new { Year = it.TransactionDate.Year, Month = it.TransactionDate.Month } into g
                                         select new
                                         {
                                             Date = new DateTime(g.Key.Year, g.Key.Month, 1),
                                             TotalStockIn = g.Sum(x => x.sub != null && x.it.TransactionType == "Stock In" ? x.sub.Quantity : 0),
                                             TotalStockOut = g.Sum(x => x.sub != null && x.it.TransactionType == "Stock Out" ? x.sub.Quantity : 0)
                                         }).ToListAsync();

                    var chartData = new ChartData
                    {
                        Labels = Monthly.Select(d => d.Date.ToString("MMMM yyyy")).ToArray(),
                        Data = Monthly.Select(d => new ChartDataPoint { TotalStockIn = d.TotalStockIn, TotalStockOut = d.TotalStockOut }).ToArray()
                    };

                    TempData["SalesFilter"] = "Monthly Stock";
                    ViewData["Inventory"] = chartData;
                }
                else if (filter == "Yearly")
                {
                    var Yearly = await (from it in _context.InventoryTransaction
                                 join itd in _context.InventoryTransactionDetail on it.InventoryTransactId equals itd.InventoryTransactId into gj
                                 from sub in gj.DefaultIfEmpty()
                                 group new { it, sub } by it.TransactionDate.Year into g
                                 select new 
                                 {
                                     Date = new DateTime(g.Key, 1, 1), // First day of the year
                                     TotalStockIn = g.Sum(x => x.sub != null && x.it.TransactionType == "Stock In" ? x.sub.Quantity : 0),
                                     TotalStockOut = g.Sum(x => x.sub != null && x.it.TransactionType == "Stock Out" ? x.sub.Quantity : 0)
                                 }).ToListAsync();
                  

                    var chartData = new ChartData
                    {
                        Labels = Yearly.Select(d => d.Date.ToString("yyyy")).ToArray(), // Display year only
                        Data = Yearly.Select(d => new ChartDataPoint { TotalStockIn = d.TotalStockIn, TotalStockOut = d.TotalStockOut }).ToArray()
                    };

                    TempData["SalesFilter"] = "Yearly Stock";
                    ViewData["Inventory"] = chartData;
                }

            }

            return View();
        }

        [HttpPost]
        public async Task< IActionResult > GetChartData(string type, DateTime fromDate, DateTime toDate)
        {
           
            if(type == "Sales")
            {
                var dataarray = await _context.OrderDetails
               .Where(od => od.Order.OrderDate.Date >= fromDate.Date && od.Order.OrderDate.Date <= toDate.Date)
               .Select(od => new
               {
                   OrderDate = od.Order.OrderDate,
                   TotalSales = od.Order.TotalAmount
               })
               .GroupBy(od => od.OrderDate)
               .Select(g => new
               {
                   OrderDate = g.Key,
                   TotalSales = g.Sum(x => x.TotalSales)
               }).ToListAsync();

                var chartData = new
                {
                    labels = dataarray.Select(x => x.OrderDate.ToString("yyyy-MM-dd")).ToArray(),
                    data = dataarray.Select(x => x.TotalSales).ToArray()
                };
                return Json(chartData);

            }
            else if (type == "Inventory")
            {
                var stockReport = await (from it in _context.InventoryTransaction
                                         join itd in _context.InventoryTransactionDetail on it.InventoryTransactId equals itd.InventoryTransactId into gj
                                         from sub in gj.DefaultIfEmpty()
                                         where it.TransactionDate >= fromDate && it.TransactionDate <= toDate
                                         group new { it, sub } by it.TransactionDate into g
                                         select new
                                         {
                                             Date = g.Key,
                                             TotalStockIn = g.Sum(x => x.sub != null && x.it.TransactionType == "Stock In" ? x.sub.Quantity : 0),
                                             TotalStockOut = g.Sum(x => x.sub != null && x.it.TransactionType == "Stock Out" ? x.sub.Quantity : 0)
                                         }).ToListAsync();


                var chartData = new
                {
                    labels = stockReport.Select(x => x.Date.ToString("yyyy-MM-dd")).ToArray(),
                    data = stockReport.Select(d => new ChartDataPoint { TotalStockIn = d.TotalStockIn, TotalStockOut = d.TotalStockOut }).ToArray()
                };
                return Json(chartData);
            }
            return Json(null);
        }
    }
}
