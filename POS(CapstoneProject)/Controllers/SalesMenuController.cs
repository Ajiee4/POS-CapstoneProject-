using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class SalesMenuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
