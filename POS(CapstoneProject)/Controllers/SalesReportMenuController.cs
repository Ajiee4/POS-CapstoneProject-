using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class SalesReportMenuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
