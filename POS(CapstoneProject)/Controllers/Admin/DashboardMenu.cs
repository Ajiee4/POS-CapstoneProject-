using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;

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
        public IActionResult Index()
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
                        HttpContext.Session.Clear();
                        return RedirectToAction("Login", "Authentication");
                    }
                    else
                    {
                        var userCount = _context.User.Where(s => s.RoleId != 1).Count();
                        ViewData["CountUser"] = userCount;
                        var totalSales = _context.Order.Where(s => s.OrderDate == DateTime.Now.Date).Sum(s => s.TotalAmount);
                        ViewData["TotalSales"] = totalSales;
                        var productCount = _context.Product.Count();
                        ViewData["CountProduct"] = userCount;
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
