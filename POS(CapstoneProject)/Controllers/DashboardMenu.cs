using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class DashboardMenu : Controller
    {
        public IActionResult Index()
        {
            var name = HttpContext.Session.GetString("UserName");
            return View();
        }
    }
}
