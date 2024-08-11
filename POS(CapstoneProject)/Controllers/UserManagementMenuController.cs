using Microsoft.AspNetCore.Mvc;

namespace POS_CapstoneProject_.Controllers
{
    public class UserManagementMenuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
