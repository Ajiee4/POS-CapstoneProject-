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
                                    OrderDate = g.Key.OrderDate.ToString(),
                                    TotalSales = g.Sum(x => x.od.Quantity * x.p.Price),
                                    TotalSold = g.Select(s => s.p.ProductId).Count()
                                })
                                .OrderBy(result => result.OrderDate)
                                .ThenBy(result => result.Name)
                                .ToListAsync();

                TempData["SalesReport"] = JsonConvert.SerializeObject(salesRep);

            }
            else if(reportType == "Inventory Report")
            {
              
                var inventoryTransactions = await _context.InventoryTransaction.ToListAsync();
                var inventoryDetails =await _context.InventoryTransactionDetail.ToListAsync();

               
                foreach (var item in inventoryDetails)
                {
                    string[] parts = item.Quantity.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                 
                    item.Quantity = parts[2];  
                    
                }
           
                var inventoryRep = (from it in inventoryTransactions
                                    join itd in inventoryDetails on it.InventoryTransactId equals itd.InventoryTransactId
                                    join i in _context.Ingredient on itd.IngredientId equals i.IngredientId
                                    group new { it, itd } by new { i.Name, it.TransactionDate } into g
                                    select new InventoryReport
                                    {
                                        Name = g.Key.Name,
                                        TransactionDate = g.Key.TransactionDate,
                                        TotalStockOut = g.Sum(x => x.it.TransactionType == "Stock Out" ?
                                            Convert.ToInt16(x.itd.Quantity) : 0),
                                        TotalStockIn = g.Sum(x => x.it.TransactionType == "Stock In" ?
                                            Convert.ToInt16(x.itd.Quantity) : 0)
                                    })
                                    .OrderBy(x => x.TransactionDate)
                                    .ToList();  

               
                TempData["InventoryReport"] = JsonConvert.SerializeObject(inventoryRep);



            }


            return RedirectToAction("Index");
       
        }



    }

}
