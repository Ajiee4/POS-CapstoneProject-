using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class ProductMenuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
