using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;
using System.Runtime.InteropServices;

namespace POS_CapstoneProject_.Controllers
{
    public class CategoryMenuController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;

        public CategoryMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public async Task<IActionResult>Index()
        {
            //create a list of categories
            var categoryList = await _context.Category.ToListAsync();
            ViewData["CategoryList"] = categoryList; //store the list in the viewdata to display on the view

            return View();
        }
        //receive the http request from the view when the form wis submitted
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddCategory(Category category)
        {
            
            if (ModelState.IsValid)
            {   
                //check if the submitted data already exist in the database
                var categoryNames =  _context.Category.Where(s => s.CategoryName == category.CategoryName && s.CategoryType == category.CategoryType).FirstOrDefault();
                if (categoryNames == null) //if the name does not exist then save it to the database
                {
                   
                    //save to db
                    _context.Add(category);
                    await _context.SaveChangesAsync();

                    //pass message to the view
                    TempData["AddedCategory"] = "";

                }
                else
                {
                    //pass message to the view
                    TempData["CategoryExist"] = "";
                }              

            }

            return RedirectToAction("Index");
        }

        //receive the http request from the view when the form wis submitted
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateCategory(Category category)
        {
            if (ModelState.IsValid)
            {
                //check if the submitted data already exist in the database
                var categoryNames = _context.Category.Where(s => s.CategoryName == category.CategoryName && s.CategoryType == category.CategoryType).FirstOrDefault();
                if (categoryNames == null)
                {
                    _context.Update(category);
                    await _context.SaveChangesAsync();
                    TempData["UpdatedCategory"] = "";
                }
                else
                {
                    //if the data already exist, send an error message
                    TempData["Exist"] = "";
                }

            }

            return RedirectToAction("Index");
        }
    }
}
