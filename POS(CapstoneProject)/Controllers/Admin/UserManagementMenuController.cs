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

        public async Task GetData()
        {
            var userList = await _context.UserDetail
                                         .Include(x => x.User)
                                         .Include(s => s.User.Role)
                                         .OrderBy(s => s.UserId).ToListAsync();

            var roleList = await _context.Role
                                         .ToListAsync();

            ViewData["UserList"] = userList;
            ViewData["RoleList"] = roleList;

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
                       
                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {


                        await GetData();

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

            try
            {               
                var checkUser = await _context.UserDetail.Include(s => s.User).Where(s => s.User.Username == username || s.EmailAddress == email).FirstOrDefaultAsync();

                if (checkUser != null)
                {
                    if(checkUser.User.Username == username)
                    {
                        ViewData["ExistUsername"] = "";
                    }
                    else if(checkUser.EmailAddress == email)
                    {
                        ViewData["ExistEmail"] = "";
                    }
                    
                }
                else
                {
                   
                    if (role == "Admin")
                    {
                        User adduser = new User()
                        {
                            Username = username,
                            Password = password,
                            RoleId = 1,
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
                    else if (role == "Cashier")
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




                    ViewData["AddUser"] = "";
                }
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
            finally
            {
                await GetData();
            }


            return View("Index");
        }


        [HttpPost]
        [AutoValidateAntiforgeryToken]
        public async Task<IActionResult> UpdateUser(int userid, string firstname, string lastname, string email, string cellnumber, string username, string password, string role)
        {
            try
            {           

                var checkUser = await _context.UserDetail
                                              .Include(s => s.User)
                                              .ThenInclude(s => s.Role)
                                              .Where(s => s.UserId == userid)
                                              .FirstOrDefaultAsync();

                if (checkUser != null)
                {
                    if (checkUser?.User.Username == username && checkUser.User.Password == password && checkUser?.Firstname == firstname &&
                        checkUser.Lastname == lastname && checkUser.EmailAddress == email && checkUser.ContactNumber == cellnumber)
                    {
                        ViewData["NoChanges"] = "";
                    }
                    else
                    {
                        var findUser = await _context.UserDetail
                                                     .Include(s => s.User)
                                                     .Where(s => s.UserId == userid)
                                                     .FirstOrDefaultAsync();

                        var checkExisting = await _context.UserDetail
                                                          .Include(s => s.User)
                                                          .Where(s => s.User.Username == username || s.EmailAddress == email)
                                                          .FirstOrDefaultAsync();
                      
                        if (checkExisting.UserId != findUser.UserId)
                        {
                            if (checkExisting.User.Username == username)
                            {
                                ViewData["ExistUsername"] = "";
                            }
                            else if (checkExisting.EmailAddress == email)
                            {
                                ViewData["ExistEmail"] = "";
                            }

                        }
                        else
                        {

                            checkUser.User.Username = username;
                            checkUser.User.Password = password;
                            checkUser.Firstname = firstname;
                            checkUser.Lastname = lastname;
                            checkUser.EmailAddress = email;
                            checkUser.ContactNumber = cellnumber;                        

                            _context.UserDetail.Update(checkUser);
                            await _context.SaveChangesAsync();

                            ViewData["UpdateUser"] = "";

                        }

                    }

                }
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
            finally
            {
                await GetData();
            }


            return View("Index");

        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UnarchiveUser(int userid)
        {
            try
            {
                var findUser = await _context.User
                                             .Where(s => s.UserId == userid)
                                             .FirstOrDefaultAsync();

                if (findUser != null)
                {
                    findUser.isArchive = false;

                    _context.User.Update(findUser);
                    await _context.SaveChangesAsync();

                    ViewData["SuccessUnarchived"] = "";
                }
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
            finally
            {
                await GetData();
            }



            return View("Index");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ArchiveUser(int userid)
        {
            try
            {
                var findUser = await _context.User
                                             .Where(s => s.UserId == userid)
                                             .FirstOrDefaultAsync();
                if (findUser != null)
                {
                    findUser.isArchive = true;

                    _context.User.Update(findUser);
                    await _context.SaveChangesAsync();

                    ViewData["SuccessArchived"] = " ";
                }
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
            finally
            {
                await GetData();
            }

            return View("Index");
        }

    }
}
