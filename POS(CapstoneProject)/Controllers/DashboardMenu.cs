using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class DashboardMenu : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
