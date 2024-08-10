using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers
{
    public class AuthenticationController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;
        public AuthenticationController(POS_CapstoneProject_Context context) 
        {
            _context = context;
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Blank()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(User user)
        {
            if (ModelState.IsValid)
            {
                var checkUser = _context.User.Where(s => s.Username == user.Username).FirstOrDefault();

                if (checkUser == null)
                {
                    TempData["ErrorMessage"] = "Username does not exist";
                    ModelState.Clear();
                    user = new User(); // Clear the form fields by returning a new/empty model

                    // Return the same view with an empty model to clear the inputs
                    return View(user);

                }
                else
                {
                    TempData["Success"] = "Username does not exist";
                    ModelState.Clear();
                    user = new User(); // Clear the form fields by returning a new/empty model

                    // Return the same view with an empty model to clear the inputs
                    return View(user);
                }
            }
            return View();
        }
    }
}
