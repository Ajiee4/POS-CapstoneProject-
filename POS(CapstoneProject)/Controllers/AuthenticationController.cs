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
        public async Task<IActionResult> Login(string Username, string Password)
        {
            if (ModelState.IsValid)
            {
                //return a record based on a condition
                var checkUsername = await _context.User.Where(s => s.Username == Username).FirstOrDefaultAsync();

                //checks the record if it is null
                if (checkUsername == null)
                {
                    //send a message to the view
                    TempData["NotExist"] = "Username does not exist";                
                }
                else //if there's a record
                {
                    //check if password is correct
                    if(checkUsername.Password == Password)
                    {
                        //send a message to the view
                        TempData["Success"] = "Success"; 
                    }
                    else //if password does not match
                    {
                        TempData["IncorrectPassword"] = "Incorrect password";
                    }           
                  
                }

                
            }

            return View();
        }
    }
}
