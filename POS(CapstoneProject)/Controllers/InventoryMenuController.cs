using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class InventoryMenuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
