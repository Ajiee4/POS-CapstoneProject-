using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class ManagerInterfaceController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
