using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;
using System.Data;

namespace POS_CapstoneProject_.Controllers.Admin
{
    public class UserManagementMenuController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;
        public UserManagementMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {

            var UserId = HttpContext.Session.GetInt32("UserID");
            if (UserId != null)
            {
                var check = await _context.User
                                .Where(s => s.UserId == UserId)
                                .FirstOrDefaultAsync();
                if (check != null)
                {
                    if (check.RoleId != 1)
                    {
                        //HttpContext.Session.Clear();
                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {
                        var userList = await _context.UserDetail
                                            .Include(x => x.User)
                                            .Include(s => s.User.Role)
                                            .OrderBy(s => s.UserId).ToListAsync();

                        var roleList = await _context.Role.ToListAsync();

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
        public async Task<IActionResult> AddUser(string firstname, string lastname, string email, string cellnumber, string username, string password, string role)
        {
            var checkUser = await _context.User
                                .Where(s => s.Username == username)
                                .FirstOrDefaultAsync();

            if (checkUser != null)
            {
                TempData["Exist"] = "";
            }
            else
            {
                if(role == "Admin")
                {
                    var adduser = new User()
                    {
                        Username = username,
                        Password = password,
                        RoleId = 1,
                        isArchive = false
                    };

                    await _context.User.AddAsync(adduser);
                    await _context.SaveChangesAsync();

                   
                }
                else if(role == "Cashier")
                {
                    var adduser = new User()
                    {
                        Username = username,
                        Password = password,
                        RoleId = 2,
                        isArchive = false
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
                }
                

              

                TempData["AddUser"] = "";
            }

            return RedirectToAction("Index");
        }


        [HttpPost]
        [AutoValidateAntiforgeryToken]
        public async Task<IActionResult> UpdateUser(int userid, string firstname, string lastname, string email, string cellnumber, string username, string password, string role)
        {

            var findUser = await _context.User.Include(s => s.Role)
                                .Where(s => s.UserId == userid)
                                .FirstOrDefaultAsync(); 

            var findUserDetail = await _context.UserDetail
                                        .Where(s => s.UserId == userid)
                                        .FirstOrDefaultAsync();
           
            if (findUser != null && findUserDetail != null)
            {
                if (findUser?.Username == username && findUser.Password == password && findUserDetail?.Firstname == firstname &&
                    findUserDetail.Lastname == lastname && findUserDetail.EmailAddress == email && findUserDetail.ContactNumber == cellnumber)
                {
                    TempData["NoChanges"] = "";
                }
                else
                {
                    //var getRole = await _context.Role.Where(s => s.RoleName == role).FirstOrDefaultAsync();

                    findUser.Username = username;
                    findUser.Password = password;
                    //findUser.RoleId = getRole.RoleId;

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
            var findUser = await _context.User
                                .Where(s => s.UserId == userid)
                                .FirstOrDefaultAsync();

            if (findUser != null)
            {
                findUser.isArchive = false;

                _context.User.Update(findUser);
                await _context.SaveChangesAsync();

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
                findUser.isArchive = true;

                _context.User.Update(findUser);
                await _context.SaveChangesAsync();

                TempData["SuccessArchived"] = " ";
            }


            return RedirectToAction("Index");
        }

    }
}
