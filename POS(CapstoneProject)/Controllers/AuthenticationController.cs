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

        [HttpPost]
       
        public async Task<IActionResult> Login(User user)
        {
           
                //return a record based on a condition
            var checkUsername = await _context.User.Where(s => s.Username == user.Username).Include(s => s.Role).FirstOrDefaultAsync();

            //checks the record if it is null
            if (checkUsername == null)
            {
                //send a message to the view
                TempData["NotExist"] = "Username does not exist";

            }
            else //if there's a record
            {
               
                
                    //check if password is correct
                    if (checkUsername.Password == user.Password)
                    {
                        var check = await _context.UserDetail.Where(s => s.UserId == checkUsername.UserId).FirstOrDefaultAsync();
                      
                        if (checkUsername.RoleId == 1) //Manager/Admin
                        {
                            HttpContext.Session.SetInt32("UserID", check.UserId);
                            HttpContext.Session.SetString("Name", check.Firstname);
                            return RedirectToAction("Index", "DashboardMenu");
                        }

                        else if(checkUsername.RoleId == 2)//Cashier
                        {
                            HttpContext.Session.SetInt32("UserID", check.UserId);
                            HttpContext.Session.SetString("Name", check.Firstname);
                            return RedirectToAction("Index", "CashierInterface");

                        }

                        else if(checkUsername.RoleId == 3)//Stock Manager
                        {
                            HttpContext.Session.SetInt32("UserID", check.UserId);
                            HttpContext.Session.SetString("Name", check.Firstname);
                            return RedirectToAction("Index", "StockManagerInterface");
                        }
                        //TempData["Success"] = "Success";
                      


                    }
                    else //if password does not match
                    {
                        TempData["IncorrectPassword"] = "Incorrect password";

                    }
                  
                
             

            }



            return View();
           
        }
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();

            return RedirectToAction("Login");
        }
    }
}
