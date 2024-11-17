using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;
using System.Runtime.InteropServices;

namespace POS_CapstoneProject_.Controllers.Admin
{
    public class CategoryMenuController : Controller
    {
        //database context
        private readonly POS_CapstoneProject_Context _context;

        //constructor
        public CategoryMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public async Task GetData()
        {
           
            var categoryList = await _context.Category
                                             .OrderBy(s => s.CategoryId)
                                             .ToListAsync();

            ViewData["CategoryList"] = categoryList;
        }
        public async Task<IActionResult> Index()
        {
           
            var UserId = HttpContext.Session.GetInt32("UserID");
       
            if (UserId != null) 
            {

                var check = await  _context.User
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
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddCategory(Category category)
        {

            try
            {
                var categoryNames = _context.Category
                                            .Where(s => s.CategoryName == category.CategoryName)
                                            .FirstOrDefault();

                if (categoryNames == null) 
                {
                    _context.Add(category);
                    await _context.SaveChangesAsync();

                    ViewData["AddedCategory"] = "";

                }
                else
                {

                    ViewData["CategoryExist"] = "";
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
        public async Task<IActionResult> UpdateCategory(Category category)
        {
            try
            {
                var checkCategory = await _context.Category
                                                  .Where(s => s.CategoryId == category.CategoryId)
                                                  .FirstOrDefaultAsync();
                if (checkCategory != null)
                {
                    if (checkCategory.CategoryName == category.CategoryName)
                    {
                        ViewData["NoChanges"] = " ";
                    }
                    else
                    {

                        var checkName = await _context.Category
                                                      .Where(s => s.CategoryName == category.CategoryName)
                                                      .FirstOrDefaultAsync();
                        if (checkName == null)  
                        {
                            checkCategory.CategoryName = category.CategoryName;

                            _context.Category.Update(checkCategory);
                            await _context.SaveChangesAsync();

                            ViewData["UpdatedCategory"] = "";
                        }
                        else
                        {
                            ViewData["CategoryExist"] = " ";
                        }

                    }

                }
            }
            catch(Exception e)
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
        public async Task<IActionResult> ArchiveCategory(Category category)
        {

            try
            {
                var checkCategory = await _context.Category
                                                  .Where(s => s.CategoryId == category.CategoryId)
                                                  .FirstOrDefaultAsync();

                if (checkCategory != null)
                {
                    checkCategory.IsArchive = true;

                    _context.Update(checkCategory);
                    await _context.SaveChangesAsync();

                    ViewData["SuccessArchived"] = " ";
                }
            }
            catch(Exception e)
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
        public async Task<IActionResult> UnArchiveCategory(Category category)
        {
           
            try
            {
                var checkCategory = await _context.Category
                                                  .Where(s => s.CategoryId == category.CategoryId)
                                                  .FirstOrDefaultAsync();

                if (checkCategory != null)
                {
                    checkCategory.IsArchive = false;

                    _context.Update(checkCategory);
                    await _context.SaveChangesAsync();

                    ViewData["SuccessUnarchived"] = " ";
                }

            }
            catch(Exception e)
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
