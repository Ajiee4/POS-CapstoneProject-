using Microsoft.AspNetCore.Mvc;
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
        public IActionResult Index()
        {
            var getCategoryProduct = _context.Category.Where(s => s.CategoryType == "Product").ToList();
            ViewData["productCategory"] = getCategoryProduct;
            return View();
        }
    }
}
