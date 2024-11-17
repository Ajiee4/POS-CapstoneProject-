using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.DTO;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers.Cashier
{
    public class SalesController : Controller
    {

        private readonly POS_CapstoneProject_Context _context;
        public SalesController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public async Task GetData()
        {

            var categoryList = await _context.Category
                                       .Where(s => s.IsArchive == false)
                                       .ToListAsync();

            var productList = await _context.Product
                                    .Include(s => s.Category)
                                    .Where(s => s.IsArchive == false && s.Category.IsArchive == false)
                                    .ToListAsync();

            ViewData["CategoryList"] = categoryList;
            ViewData["ProductList"] = productList;


        }


        public async Task<IActionResult> Index()
        {
           

            var UserId = HttpContext.Session.GetInt32("UserID");
            if (UserId != null)
            {
                var check = _context.User.Where(s => s.UserId == UserId).FirstOrDefault();
                if (check != null)
                {
                    if (check.RoleId != 2)
                    {
                        //HttpContext.Session.Clear();
                        return RedirectToAction("Index", "DashboardMenu");
                    }
                    else
                    {
                        await GetData();

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
        public async Task<IActionResult> SalesTransaction(string checkoutList, decimal checkoutTotal, string changeDueAmount, string discount, string cashTendered, string subTotalAmount, string totalString)
        {
            try
            {
                int? userId = HttpContext.Session.GetInt32("UserID") as int?;
                var user = await _context.UserDetail
                                .Where(s => s.UserId == userId)
                                .FirstOrDefaultAsync();

                if (user != null)
                {
                    //created an object to save the order          
                    Order order = new Order()
                    {
                        UserId = user.UserId,
                        TotalAmount = checkoutTotal,
                        OrderDate = DateTime.Now.Date
                    };

                    //save order in db
                    await _context.Order.AddAsync(order);
                    await _context.SaveChangesAsync();

                    //converting from JSON to .Net Type
                    var myList = JsonConvert.DeserializeObject<List<CheckOutList>>(checkoutList);

                    if (myList! != null)
                    {
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
                        await _context.SaveChangesAsync();
                    }

                    Receipt receipt = new Receipt()
                    {
                        OrderID = order.OrderId,
                        UserID = user.UserId,
                        TotalAmount = checkoutTotal,
                        TaxAmount = 0,
                        DiscountAmount = Convert.ToDecimal(discount),
                        ChangeDue = Convert.ToDecimal(changeDueAmount),
                        CashTendered = Convert.ToDecimal(cashTendered),
                        Date = DateTime.Now.Date
                    };

                    await _context.AddAsync(receipt);
                    await _context.SaveChangesAsync();

                    ViewData["TransactionComplete"] = "Transaction Complete";
                    ViewData["UserName"] = user.Firstname + " " + user.Lastname;

                    var orderReceipt = await _context.Receipt.Where(s => s.OrderID == order.OrderId).FirstOrDefaultAsync();
                    ViewData["Receipt"] = JsonConvert.SerializeObject(orderReceipt);
                }


            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
            finally
            {
                await GetData();
            }

            return View("Index");
        }
    }
}
