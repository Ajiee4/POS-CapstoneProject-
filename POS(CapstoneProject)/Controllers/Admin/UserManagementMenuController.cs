using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers.Admin
{
    public class UserManagementMenuController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;
        public UserManagementMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }

        public IActionResult Index()
        {

            var UserId = HttpContext.Session.GetInt32("UserID");
            if (UserId != null)
            {
                var check = _context.User.Where(s => s.UserId == UserId).FirstOrDefault();
                if (check != null)
                {
                    if (check.RoleId != 1)
                    {
                        //HttpContext.Session.Clear();
                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {
                        var userList = _context.UserDetail.Include(x => x.User).Include(s => s.User.Role).ToList();
                        var roleList = _context.Role.Where(s => s.RoleName != "Manager").ToList();
                        ViewData["UserList"] = userList;
                        ViewData["RoleList"] = roleList;

                        return View();
                    }
                }
                else
                {
                    return RedirectToAction("Login", "Authentication");
                }
            }
            else
            {
                return RedirectToAction("Login", "Authentication");
            }

        }


        [HttpPost]
        [AutoValidateAntiforgeryToken]
        public async Task<IActionResult> AddUser(string firstname, string lastname, string email, string cellnumber, string username, string password)
        {
            var checkUser = _context.User.Where(s => s.Username == username).FirstOrDefault();
            if (checkUser != null)
            {
                TempData["Exist"] = "";
            }
            else
            {
                var adduser = new User()
                {
                    Username = username,
                    Password = password,
                    RoleId = 2,
                    isActive = true
                };


                await _context.User.AddAsync(adduser);
                await _context.SaveChangesAsync();

                var userDetails = new UserDetail()
                {
                    UserId = adduser.UserId,
                    Firstname = firstname,
                    Lastname = lastname,
                    EmailAddress = email,
                    ContactNumber = cellnumber,
                };


                await _context.UserDetail.AddAsync(userDetails);
                await _context.SaveChangesAsync();

                TempData["AddUser"] = "";



            }

            return RedirectToAction("Index");
        }


        [HttpPost]
        [AutoValidateAntiforgeryToken]
        public async Task<IActionResult> UpdateUser(int userid, string firstname, string lastname, string email, string cellnumber, string username, string password)
        {

            var findUser = await _context.User.Where(s => s.UserId == userid).FirstOrDefaultAsync(); 
            var findUserDetail = await _context.UserDetail.Where(s => s.UserId == userid).FirstOrDefaultAsync();

           
            if (findUser != null && findUserDetail != null)
            {
                if (findUser?.Username == username && findUser.Password == password && findUserDetail?.Firstname == firstname &&
               findUserDetail.Lastname == lastname && findUserDetail.EmailAddress == email && findUserDetail.ContactNumber == cellnumber)
                {
                    TempData["NoChanges"] = "";
                }
                else
                {
                    findUser.Username = username;
                    findUser.Password = password;
                    _context.User.Update(findUser);
                    await _context.SaveChangesAsync();

                    findUserDetail.Firstname = firstname;
                    findUserDetail.Lastname = lastname;
                    findUserDetail.EmailAddress = email;
                    findUserDetail.ContactNumber = cellnumber;

                    _context.UserDetail.Update(findUserDetail);
                    await _context.SaveChangesAsync();

                    TempData["UpdateUser"] = "";
                }
               
            }
     
            return RedirectToAction("Index");

        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UnarchiveUser(int userid)
        {
            var findUser = await _context.User.Where(s => s.UserId == userid).FirstOrDefaultAsync();
            if (findUser != null)
            {
                findUser.isActive = true;
                _context.User.Update(findUser);
                _context.SaveChanges();
                TempData["SuccessUnarchived"] = "";
            }


            return RedirectToAction("Index");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ArchiveUser(int userid)
        {
            var findUser = await _context.User.Where(s => s.UserId == userid).FirstOrDefaultAsync();
            if (findUser != null)
            {
                findUser.isActive = false;
                _context.User.Update(findUser);
                _context.SaveChanges();
                TempData["SuccessArchived"] = " ";
            }


            return RedirectToAction("Index");
        }

    }
}
