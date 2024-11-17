using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;
using MailKit.Net.Smtp;


namespace POS_CapstoneProject_.Controllers.Login
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
        public IActionResult ForgotPassword()
        {
            return View();
        }
        public IActionResult CodeVerification()
        {

            var resetEmail = HttpContext.Session.GetString("ResetEmail");
            if (resetEmail == null)
            {
                return RedirectToAction("Login");
            }
            return View();
        }
        public IActionResult CreatePassword()
        {
            var resetEmail = HttpContext.Session.GetString("ResetEmail");
            if (resetEmail == null)
            {
                return RedirectToAction("Login");
            }
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(User user)
        {
            try
            {
                //return a record based on a condition
                var checkUsername = await _context.User.Where(s => s.Username == user.Username).Include(s => s.Role).FirstOrDefaultAsync();

                //checks the record if it is null
                if (checkUsername == null)
                {
                    //send a message to the view
                    ViewData["NotExist"] = "Username not found";

                }
                else
                {

                    //check if password is correct
                    if (checkUsername.Password == user.Password)
                    {
                        //var check = await _context.UserDetail.Where(s => s.UserId == checkUsername.UserId).FirstOrDefaultAsync();

                        if (checkUsername.isArchive == true)
                        {
                            ViewData["Deactivated"] = "Account is unavailable";

                        }
                        else
                        {
                            switch (checkUsername.RoleId)
                            {
                                case 1:
                                    HttpContext.Session.SetInt32("UserID", checkUsername.UserId);

                                    return RedirectToAction("Index", "SalesMenu");

                                case 2:
                                    HttpContext.Session.SetInt32("UserID", checkUsername.UserId);

                                    return RedirectToAction("Index", "Sales");


                            }

                            ViewData["Success"] = "Logged In Successfully";


                        }

                    }
                    else
                    {
                        ViewData["IncorrectPassword"] = "Incorrect Password";

                    }

                }

            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }


            return View();
        }

        //send the code
        [HttpPost]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            try
            {
                var checkUser = _context.UserDetail.Where(s => s.EmailAddress == email).FirstOrDefault();
                if (checkUser == null)
                {
                    ViewData["NotExist"] = "";
                }
                else
                {

                    using (var client = new SmtpClient())
                    {
                        var random = new Random();
                        string resetCode = random.Next(100000, 999999).ToString();


                        HttpContext.Session.SetString("ResetEmail", email);
                        HttpContext.Session.SetString("ResetCode", resetCode);
                        HttpContext.Session.SetString("CodeExpiration", DateTime.Now.AddMinutes(1).ToString());


                        // Connect to Gmail SMTP server with SSL
                        await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

                        // Authenticate using your credentials or App Password
                        await client.AuthenticateAsync("gemidaaljon4@gmail.com", "chir xspr dceq tnxt");

                        // Build the email content
                        var bodyBuilder = new BodyBuilder
                        {
                            HtmlBody = $"<p>Your password reset code is: <b>{resetCode}</b></p>",
                            TextBody = $"Your password reset code is: {resetCode}"
                        };

                        var message = new MimeMessage
                        {
                            Subject = "Password Reset Code",
                            Body = bodyBuilder.ToMessageBody()
                        };

                        message.From.Add(new MailboxAddress("Admin Aljon", "gemidaaljon4@gmail.com"));
                        message.To.Add(new MailboxAddress("User", email));

                        // Send the email
                        await client.SendAsync(message);
                        await client.DisconnectAsync(true);
                    }

                    ViewData["Success"] = "";

                }

            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }

          

            return View();
        }
        [HttpPost]
        public async Task<IActionResult> CodeVerification(string code)
        {
            try
            {
                string verificationCode = HttpContext.Session.GetString("ResetCode");
                string email = HttpContext.Session.GetString("ResetEmail");

                if (code == verificationCode)
                {
                    return RedirectToAction("CreatePassword");
                }
                else
                {
                    ViewData["IncorrectCode"] = "The code you entered is incorrect.";
                }
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
          

            return View();

        }
   
        


        [HttpPost]
        public async Task<IActionResult> CreatePassword(string password)
        {
            try
            {
                string email = HttpContext.Session.GetString("ResetEmail");
                var checkUserEmail = _context.UserDetail.Where(s => s.EmailAddress == email).FirstOrDefault();
                var checkUser = _context.User.Where(s => s.UserId == checkUserEmail.UserId).FirstOrDefault();

                checkUser.Password = password;
                _context.User.Update(checkUser);
                await _context.SaveChangesAsync();


                HttpContext.Session.Remove("ResetEmail");
                HttpContext.Session.Remove("ResetCode");
                HttpContext.Session.Remove("CodeExpiration");

                ViewData["PasswordChanged"] = "";
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
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
