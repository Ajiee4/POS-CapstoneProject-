using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class InventoryMenuController : Controller
    {
        public IActionResult InventoryList()
        {
            return View();
        }
        public IActionResult StockMovement()
        {
            return View();
        }
    }
}
