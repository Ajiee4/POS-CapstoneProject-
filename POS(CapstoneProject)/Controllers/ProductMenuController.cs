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
            var productList = await _context.Product.Include(s => s.Category).ToListAsync();
            var getCategoryProduct = await _context.Category.Where(s => s.CategoryType == "Product").ToListAsync();
            ViewData["productCategory"] = getCategoryProduct;
            ViewData["productList"] = productList;
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddProduct(Product prod, IFormFile file)
        {
           
            if(file == null)
            {
                
                _context.Add(prod);
                await _context.SaveChangesAsync();
            }
            else
            {
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    prod.ImageData = ms.ToArray();
                }
                _context.Add(prod);
                await _context.SaveChangesAsync();
            }
                
            
            
               
            
                
            

            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProduct(Product prod, IFormFile file)
        {
          
          
            if (file == null)
            {
                _context.Update(prod);
                await _context.SaveChangesAsync();

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
                TempData["SuccessArchived"] = " ";

                checkProduct.IsArchive = true;
                _context.Update(checkProduct);
                await _context.SaveChangesAsync();

              
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
                TempData["SuccessUnarchived"] = " ";

                checkProduct.IsArchive = false;
                _context.Update(checkProduct);
                await _context.SaveChangesAsync();


            }

            return RedirectToAction("Index");
        }
    }
}
