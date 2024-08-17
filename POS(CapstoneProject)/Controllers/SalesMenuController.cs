using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using POS_CapstoneProject_.Data;

namespace POS_CapstoneProject_.Controllers
{
    public class SalesMenuController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;
        public SalesMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            var categoryList = await _context.Category.ToListAsync();
            var productList = await _context.Product.Where(s => s.IsArchive == false).Include(s => s.Category).ToListAsync();
            ViewData["CategoryList"] = categoryList;
            ViewData["ProductList"] = productList;
            return View();
        }
    }
}
