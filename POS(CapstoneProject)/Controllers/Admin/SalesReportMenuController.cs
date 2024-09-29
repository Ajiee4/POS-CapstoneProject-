using Humanizer;
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
        public async Task<IActionResult> DisplayReport(string reportType, DateTime fromDate, DateTime toDate)
        {
            if(reportType == "Sales Report")
            {
                var salesRep = await _context.Order
                    .Join(_context.OrderDetails,
                            o => o.OrderId,
                            od => od.OrderId,
                            (o, od) => new { o, od })
                    .Join(_context.Product,
                            o_od => o_od.od.ProductId,
                            p => p.ProductId,
                            (o_od, p) => new { o_od.o, o_od.od, p })
                    .Where(s => s.o.OrderDate >= fromDate && s.o.OrderDate <= toDate)
                    .GroupBy(g => new { g.p.Name, g.o.OrderDate })
                    .Select(g => new SalesReport
                    {
                        Name = g.Key.Name,
                        OrderDate = g.Key.OrderDate,
                        TotalSales = g.Sum(x => x.od.Quantity * x.p.Price)
                    })
                    .OrderBy(result => result.OrderDate)
                    .ThenBy(result => result.Name)
                    .ToListAsync();

                TempData["SalesReport"] = JsonConvert.SerializeObject(salesRep);

            }
            else if(reportType == "Inventory Report")
            {
                var inventoryRep = await _context.InventoryTransaction
                    .Join(_context.InventoryTransactionDetail,
                          i => i.InventoryTransactId,
                          itd => itd.InventoryTransactId,
                          (i, itd) => new { i, itd })
                    .Join(_context.Ingredient,
                          i_itd => i_itd.itd.IngredientId,
                          id => id.IngredientId,
                          (i_itd, id) => new { i_itd.i, i_itd.itd, id })
                     .Where(s => s.i.TransactionDate >= fromDate && s.i.TransactionDate <= toDate)
                    .GroupBy(g => new { g.i.TransactionDate, g.i.TransactionType, g.id.Name })
                    .Select(g => new InventoryReport
                    {
                        Name = g.Key.Name,
                        TransactionType = g.Key.TransactionType,
                        TransactionDate = g.Key.TransactionDate,
                        TotalQuantity = g.Sum(x => x.itd.Quantity)
                    })
                    .OrderBy(result => result.TransactionDate)
                    .ToListAsync();

                TempData["InventoryReport"] = JsonConvert.SerializeObject(inventoryRep);
              
            }


            return RedirectToAction("Index");
       
        }



    }

}
