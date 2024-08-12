using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;

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
    }
}
