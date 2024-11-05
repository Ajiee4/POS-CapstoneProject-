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
                        var usercount = await _context.User.CountAsync();
                        var productsCount = await _context.Product.CountAsync();
                        var dailySales = await _context.Order.Where(s => s.OrderDate == DateTime.Now.Date).SumAsync(x => x.TotalAmount);
                        var pendingRequest = await _context.Request.Where(r => r.Status == "Pending").CountAsync();
                        var pendingCount = await _context.Request.CountAsync();

                        // Define the start date for the query
                        var startDate = new DateTime(DateTime.Now.Year, 1, 1);

                        // Retrieve sales data grouped by month
                        var salesData = await _context.Order
                            .Where(o => o.OrderDate >= startDate)
                            .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                            .Select(g => new
                            {
                                Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMMM yyyy"),
                                Amount = g.Sum(x => x.TotalAmount)
                            })
                            .ToListAsync();

                        ViewData["PCount"] = productsCount;
                        ViewData["UCount"] = usercount;
                        ViewData["DailySales"] = dailySales;
                        ViewData["PendingRequest"] = pendingRequest;
                        ViewData["pendingCount"] = pendingCount;

                       
                        ViewData["SalesData"] = JsonConvert.SerializeObject(salesData);

                        var dailyRanking = _context.Order
                                        .Join(_context.OrderDetails, o => o.OrderId, od => od.OrderId, (o, od) => new { o, od })
                                        .Join(_context.Product, o_od => o_od.od.ProductId, p => p.ProductId, (o_od, p) => new { o_od.o, o_od.od, p })
                                        .Where(x => x.o.OrderDate.Date == DateTime.Now.Date);

                        var monthlyRanking = _context.Order
                                       .Join(_context.OrderDetails, o => o.OrderId, od => od.OrderId, (o, od) => new { o, od })
                                       .Join(_context.Product, o_od => o_od.od.ProductId, p => p.ProductId, (o_od, p) => new { o_od.o, o_od.od, p })
                                       .Where(x => x.o.OrderDate.Year == DateTime.Now.Year && x.o.OrderDate.Month == DateTime.Now.Month);


                        var yearlyRanking = _context.Order
                                       .Join(_context.OrderDetails, o => o.OrderId, od => od.OrderId, (o, od) => new { o, od })
                                       .Join(_context.Product, o_od => o_od.od.ProductId, p => p.ProductId, (o_od, p) => new { o_od.o, o_od.od, p })
                                       .Where(x => x.o.OrderDate.Year == DateTime.Now.Year);



                        var dailyRankingList = dailyRanking
                                                .GroupBy(g => new
                                                {
                                                    g.p.Name,
                                                    g.p.ImageData,
                                                    Month = DateTime.Now.Month
                                                })
                                                .AsEnumerable() // Switch to client-side processing
                                                .Select(g => new SalesReport
                                                {
                                                    Name = g.Key.Name,
                                                    OrderDate = CultureInfo.InvariantCulture.DateTimeFormat.GetMonthName(g.Key.Month),
                                                    TotalSales = g.Sum(x => x.od.Quantity * x.p.Price),
                                                    TotalSold = g.Sum(x => x.od.Quantity),
                                                  

                                                })
                                                .OrderBy(result => result.OrderDate)
                                                .ThenByDescending(result => result.TotalSold)
                                                .ThenBy(result => result.Name)
                                                .ToList();

                        var monthlyRankingList = monthlyRanking
                                               .GroupBy(g => new
                                               {
                                                   g.p.Name,
                                                   g.p.ImageData,
                                                   Month = DateTime.Now.Month
                                               })
                                               .AsEnumerable() // Switch to client-side processing
                                               .Select(g => new SalesReport
                                               {
                                                   Name = g.Key.Name,
                                                   OrderDate = CultureInfo.InvariantCulture.DateTimeFormat.GetMonthName(g.Key.Month),
                                                   TotalSales = g.Sum(x => x.od.Quantity * x.p.Price),
                                                   TotalSold = g.Sum(x => x.od.Quantity),
                                                

                                               })
                                               .OrderBy(result => result.OrderDate)
                                               .ThenByDescending(result => result.TotalSold)
                                               .ThenBy(result => result.Name)
                                               .ToList();


                        var yearlyRankingList = yearlyRanking
                                               .GroupBy(g => new
                                               {
                                                   g.p.Name,
                                                   g.p.ImageData,
                                                   Month = DateTime.Now.Month
                                               })
                                               .AsEnumerable() // Switch to client-side processing
                                               .Select(g => new SalesReport
                                               {
                                                   Name = g.Key.Name,
                                                   OrderDate = CultureInfo.InvariantCulture.DateTimeFormat.GetMonthName(g.Key.Month),
                                                   TotalSales = g.Sum(x => x.od.Quantity * x.p.Price),
                                                   TotalSold = g.Sum(x => x.od.Quantity),
                                                

                                               })
                                               .OrderBy(result => result.OrderDate)
                                               .ThenByDescending(result => result.TotalSold)
                                               .ThenBy(result => result.Name)
                                               .ToList();



                        ViewData["dailyRanking"] = JsonConvert.SerializeObject(dailyRankingList);
                        ViewData["monthlyRanking"] = JsonConvert.SerializeObject(monthlyRankingList);
                        ViewData["yearlyRanking"] = JsonConvert.SerializeObject(yearlyRankingList);

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
