using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers.Admin
{
    public class ProductMenuController : Controller
    {
        //db context
        private readonly POS_CapstoneProject_Context _context;

        public ProductMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        //Retrieve data from database
        public async Task GetData()
        {
            var productList = await _context.Product
                                            .Include(s => s.Category)
                                            .OrderBy(s => s.ProductId)
                                            .ToListAsync();

            var getCategoryProduct = await _context.Category
                                                   .Where(s => s.IsArchive == false)
                                                   .ToListAsync();

            ViewData["productCategory"] = getCategoryProduct;
            ViewData["productList"] = productList;
        }

        public async Task<IActionResult> Index()
        {
            //check if there's an ongoing session
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
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddProduct(Product prod)
        {

            try
            {
                //check if there's an existing product
                var checkExisting = await _context.Product
                                        .Where(s => s.Name == prod.Name && s.ProdCategoryId == prod.ProdCategoryId)
                                        .FirstOrDefaultAsync();

                if (checkExisting == null)
                {

                    _context.Add(prod);
                    await _context.SaveChangesAsync();

                    ViewData["ProductAdded"] = "Added new product";
                }
                else
                {
                    ViewData["ProductExist"] = "Product already exist";
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
        public async Task<IActionResult> UpdateProduct(Product prod)
        {
            try
            {
                var checkProduct = await _context.Product
                                                 .Where(s => s.ProductId == prod.ProductId)
                                                 .FirstOrDefaultAsync();

                if (checkProduct != null)
                {

                    if (checkProduct.Name == prod.Name && checkProduct.Price == prod.Price && checkProduct.ProdCategoryId == prod.ProdCategoryId)
                    {
                        ViewData["NoChanges"] = "No changes detected.";
                    }
                    else
                    {

                        var checkExisting = await _context.Product
                                                          .Where(s => s.Name == prod.Name && s.ProdCategoryId == prod.ProdCategoryId && s.ProductId != prod.ProductId)
                                                          .FirstOrDefaultAsync();

                        if (checkExisting == null)
                        {

                            checkProduct.Name = prod.Name;
                            checkProduct.Price = prod.Price;
                            checkProduct.ProdCategoryId = prod.ProdCategoryId;


                            _context.Update(checkProduct);
                            await _context.SaveChangesAsync();

                            ViewData["ProductUpdated"] = "Product updated successfully.";
                        }
                        else
                        {
                            ViewData["ProductExist"] = "A product with the same name and category already exists.";
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
          
            return RedirectToAction("Index");
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ArchiveProduct(Product product)
        {

            try
            {
                var checkProduct = await _context.Product
                                                 .Where(s => s.ProductId == product.ProductId)
                                                 .FirstOrDefaultAsync();
                if (checkProduct != null)
                {
                    checkProduct.IsArchive = true;

                    _context.Update(checkProduct);
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
          

            await GetData();

            return View("Index");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UnarchiveProduct(Product product)
        {
            try
            {
                var checkProduct = await _context.Product
                                                 .Where(s => s.ProductId == product.ProductId)
                                                 .FirstOrDefaultAsync();

                if (checkProduct != null)
                {
                    checkProduct.IsArchive = false;

                    _context.Update(checkProduct);
                    await _context.SaveChangesAsync();

                    ViewData["SuccessUnarchived"] = " ";
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
