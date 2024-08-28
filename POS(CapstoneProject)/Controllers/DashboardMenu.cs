using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;

namespace POS_CapstoneProject_.Controllers
{
    public class DashboardMenu : Controller
    {
        private readonly POS_CapstoneProject_Context _context;
        public DashboardMenu(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var UserId = HttpContext.Session.GetInt32("UserID");
            if (UserId != null)
            {
                var check = _context.User.Where(s => s.UserId == UserId).FirstOrDefault();
                if(check != null)
                {
                    if(check.RoleId != 1)
                    {
                        HttpContext.Session.Clear();
                        return RedirectToAction("Login", "Authentication");
                    }
                    else
                    {
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
