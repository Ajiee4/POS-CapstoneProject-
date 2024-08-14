using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers
{
    public class ProductMenuController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;

        public ProductMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {   
            //create a variable to store a list of products including
            var productList = await _context.Product.Include(s => s.Category).ToListAsync();
            //create a variable to store a list of category that has a type of Product
            var getCategoryProduct = await _context.Category.Where(s => s.CategoryType == "Product").ToListAsync();
            //store in ViewData to pass it to the View
            ViewData["productCategory"] = getCategoryProduct;
            ViewData["productList"] = productList;

            return View();

        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddProduct(Product prod, IFormFile file)
        {
            var checkExisting = await _context.Product.Where(s => s.Name == prod.Name && s.ProdCategoryId == prod.ProdCategoryId).FirstOrDefaultAsync();

            //check if the image is null
            if (file == null)
            {
               
                if(checkExisting == null)
                {
                    //save to database
                    _context.Add(prod);
                    await _context.SaveChangesAsync();

                    TempData["ProductAdded"] = "Added new product";
                }
                else
                {
                    TempData["ProductExist"] = "Product already exist";
                }
               
            }
            else
            {
                if(checkExisting == null)
                {
                    using (var ms = new MemoryStream())
                    {
                        await file.CopyToAsync(ms);
                        prod.ImageData = ms.ToArray();
                    }
                    _context.Add(prod);
                    await _context.SaveChangesAsync();

                    TempData["ProductAdded"] = "Added new product";
                }
                else
                {
                    TempData["ProductExist"] = "Product already exist";
                }
              
            }
                         

            return RedirectToAction("Index");

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProduct(Product prod, IFormFile file)
        {
          
            //check if the 
            if (file == null)
            {
              
                _context.Update(prod);
                await _context.SaveChangesAsync();

                TempData["ProductUpdated"] = "Product updated";

            }
            else
            {
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    prod.ImageData = ms.ToArray();
                }
                _context.Update(prod);
                await _context.SaveChangesAsync();

                TempData["ProductUpdated"] = "Product updated";
            }


            return RedirectToAction("Index");

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ArchiveProduct(Product product)
        {
           
            var checkProduct = await _context.Product.Where(s => s.ProductId == product.ProductId).FirstOrDefaultAsync();
            if (checkProduct == null)
            {
                TempData["Error"] = " ";
            }
            else
            {
               

                checkProduct.IsArchive = true;
                _context.Update(checkProduct);
                await _context.SaveChangesAsync();

                TempData["SuccessArchived"] = " ";


            }

            return RedirectToAction("Index");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UnarchiveProduct(Product product)
        {

            var checkProduct = await _context.Product.Where(s => s.ProductId == product.ProductId).FirstOrDefaultAsync();
            if (checkProduct == null)
            {
                TempData["Error"] = " ";
            }
            else
            {
                

                checkProduct.IsArchive = false;
                _context.Update(checkProduct);
                await _context.SaveChangesAsync();

                TempData["SuccessUnarchived"] = " ";


            }

            return RedirectToAction("Index");
        }
    }
}
