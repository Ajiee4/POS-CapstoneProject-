using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers.Admin
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

            var UserId = HttpContext.Session.GetInt32("UserID");
            if (UserId != null)
            {
                var check = _context.User.Where(s => s.UserId == UserId).FirstOrDefault();
                if (check != null)
                {
                    if (check.RoleId != 1)
                    {
                        HttpContext.Session.Clear();
                        return RedirectToAction("Login", "Authentication");
                    }
                    else
                    {
                        //create a variable to store a list of products including
                        var productList = await _context.Product.Include(s => s.Category).ToListAsync();
                        //create a variable to store a list of category that has a type of Product
                        var getCategoryProduct = await _context.Category.ToListAsync();
                        //store in ViewData to pass it to the View
                        ViewData["productCategory"] = getCategoryProduct;
                        ViewData["productList"] = productList;

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
        public async Task<IActionResult> AddProduct(Product prod, IFormFile file)
        {
            var checkExisting = await _context.Product.Where(s => s.Name == prod.Name && s.ProdCategoryId == prod.ProdCategoryId).FirstOrDefaultAsync();

            //check if the image is null
            if (file == null)
            {

                if (checkExisting == null)
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
                if (checkExisting == null)
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
            var checkProduct = await _context.Product.Where(s => s.ProductId == prod.ProductId).FirstOrDefaultAsync();
            if (checkProduct == null)
            {

            }
            else
            {
                if (file == null)
                {
                    checkProduct.Name = prod.Name;
                    checkProduct.Price = prod.Price;
                    checkProduct.ProdCategoryId = prod.ProdCategoryId;
                    _context.Update(checkProduct);
                    await _context.SaveChangesAsync();

                    TempData["ProductUpdated"] = "Product updated";
                }

                else
                {
                    using (var ms = new MemoryStream())
                    {
                        await file.CopyToAsync(ms);
                        checkProduct.ImageData = ms.ToArray();
                    }
                    checkProduct.Name = prod.Name;
                    checkProduct.Price = prod.Price;
                    checkProduct.ProdCategoryId = prod.ProdCategoryId;
                    _context.Update(checkProduct);
                    await _context.SaveChangesAsync();

                    TempData["ProductUpdated"] = "Product updated";
                }

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
