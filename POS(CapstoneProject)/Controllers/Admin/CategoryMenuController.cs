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

        public async Task<IActionResult> Index()
        {
            //get the session
            var UserId = HttpContext.Session.GetInt32("UserID");
            //check if there's an ongoing session
            if (UserId != null) 
            {

                var check = await  _context.User
                                    .Where(s => s.UserId == UserId)
                                    .FirstOrDefaultAsync();
                if (check != null)
                {
                    //check if the user is an admin
                    if (check.RoleId != 1)
                    {
                        //clear the session and redirect to the login if the user is not an admin
                        //HttpContext.Session.Clear();
                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {
                        ////create a list of categories
                        var categoryList = await _context.Category
                                                .OrderBy(s => s.CategoryId)
                                                .ToListAsync();

                        ViewData["CategoryList"] = categoryList; 

                        return View();


                    }
                }
                else
                {
                    return RedirectToAction("Login", "Authentication");
                }
            }
            else //redirect to login if there's no ongoing session
            {
                return RedirectToAction("Login", "Authentication");
            }


        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddCategory(Category category)
        {

            if (ModelState.IsValid)
            {
               
                var categoryNames = _context.Category.Where(s => s.CategoryName == category.CategoryName).FirstOrDefault();
                if (categoryNames == null) //if the name does not exist then save it to the database
                {                 
                    _context.Add(category);
                    await _context.SaveChangesAsync();
               
                    TempData["AddedCategory"] = "";

                }
                else
                {
                   
                    TempData["CategoryExist"] = "";
                }

            }

            return RedirectToAction("Index");
        }

        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateCategory(Category category)
        {
           
               
            var checkCategory = await _context.Category
                                    .Where(s => s.CategoryId == category.CategoryId)
                                    .FirstOrDefaultAsync();
            if (checkCategory != null)
            {
                if(checkCategory.CategoryName == category.CategoryName)
                {
                    TempData["NoChanges"] = " ";
                }
                else
                {

                    var checkName = await  _context.Category
                                    .Where(s => s.CategoryName == category.CategoryName)
                                    .FirstOrDefaultAsync();
                    if(checkName == null)
                    {
                        checkCategory.CategoryName = category.CategoryName;

                        _context.Category.Update(checkCategory);
                        await _context.SaveChangesAsync();

                        TempData["UpdatedCategory"] = "";
                    }
                    else
                    {
                        TempData["CategoryExist"] = " ";
                    }
                  
                }
             
            }
         
            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ArchiveCategory(Category category)
        {

            var checkCategory = await _context.Category
                                    .Where(s => s.CategoryId == category.CategoryId)
                                    .FirstOrDefaultAsync();

            if (checkCategory != null)
            {
                checkCategory.IsArchive = true;

                _context.Update(checkCategory);
                await _context.SaveChangesAsync();

                TempData["SuccessArchived"] = " ";
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UnArchiveCategory(Category category)
        {
            var checkCategory = await _context.Category
                                    .Where(s => s.CategoryId == category.CategoryId)
                                    .FirstOrDefaultAsync();

            if (checkCategory != null)
            {
                checkCategory.IsArchive = false;

                _context.Update(checkCategory);
                await _context.SaveChangesAsync();

                TempData["SuccessUnarchived"] = " ";
            }


            return RedirectToAction("Index");
        }
    }

}
