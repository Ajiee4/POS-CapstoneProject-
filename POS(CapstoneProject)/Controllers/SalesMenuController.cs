using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NuGet.Protocol;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers
{
    public class SalesMenuController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;
        public SalesMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            var categoryList = await _context.Category.ToListAsync();
            var productList = await _context.Product.Where(s => s.IsArchive == false).Include(s => s.Category).ToListAsync();
            ViewData["CategoryList"] = categoryList;
            ViewData["ProductList"] = productList;
          
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> AddOrder(string checkoutList, decimal checkoutTotal, decimal changeDueAmount, decimal discount, decimal cashTendered, decimal subTotalAmount)
        {
            //created an object to save the order          
            Order order = new Order()
            {
                UserId = 1,
                TotalAmount = checkoutTotal,
                OrderDate = DateTime.Now.Date
            };           
            //save order in db
            await _context.Order.AddAsync(order);
            await _context.SaveChangesAsync();

            //converting from JSON to object
            var myList = JsonConvert.DeserializeObject<List<CheckOutList>>(checkoutList);
            foreach (var item in myList)
            {
                OrderDetails details = new OrderDetails
                {
                    OrderId = order.OrderId, 
                    ProductId = item.prodID,                   
                    Quantity = item.prodQty,                   
                };

                await _context.OrderDetails.AddAsync(details);
            }
            //save change to db
            await _context.SaveChangesAsync();

            var getItems = _context.Order.Include(order)
            TempData["TransactionComplete"] = " ";
            TempData["Total"] = checkoutTotal.ToString();
            TempData["SubTotal"] = subTotalAmount.ToString();
            TempData["Change"] = changeDueAmount.ToString();
            TempData["Discount"] = discount.ToString();
            TempData["Cash"] = cashTendered.ToString();
            return RedirectToAction("Index");
        }

        
    }
}
