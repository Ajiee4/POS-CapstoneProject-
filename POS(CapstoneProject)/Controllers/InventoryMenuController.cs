using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers
{
    public class InventoryMenuController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;

        public InventoryMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public IActionResult InventoryList()
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
                        var ingredientsList = _context.Ingredient.ToList();
                        ViewData["IngredientsList"] = ingredientsList;
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
        public  async Task<IActionResult> AddIngredient(Ingredient ingredient)
        {

            var newIngredient = new Ingredient()
            {
                Name = ingredient.Name,
                UnitOfMeasurement = ingredient.UnitOfMeasurement,
                Quantity = 0,
                CostPerUnit = ingredient.CostPerUnit,
                ExpiryDate = ingredient.ExpiryDate,
                LowStockThreshold = ingredient.LowStockThreshold
            };
            await _context.Ingredient.AddAsync(newIngredient);
            await _context.SaveChangesAsync();
            TempData["AddIngredient"] = " ";
            return RedirectToAction("InventoryList");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateIngredient(Ingredient ingredient)
        {
            var checkIngredient = _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefault();
            if (checkIngredient != null)
            {


                checkIngredient.Name = ingredient.Name;
                checkIngredient.UnitOfMeasurement = ingredient.UnitOfMeasurement;
                checkIngredient.CostPerUnit = ingredient.CostPerUnit;
                checkIngredient.ExpiryDate = ingredient.ExpiryDate;
                checkIngredient.LowStockThreshold = ingredient.LowStockThreshold;
             

                _context.Ingredient.Update(checkIngredient);
                await _context.SaveChangesAsync();

                TempData["UpdateIngredient"] = " ";
            }


            return RedirectToAction("InventoryList");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StockInIngredient(Ingredient ingredient, string StockInType)
        {
            int id = (int)HttpContext.Session.GetInt32("UserID");
            var checkIngredient = await _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefaultAsync();
            if(checkIngredient != null)
            {
                checkIngredient.Quantity += ingredient.Quantity;
                _context.Ingredient.Update(checkIngredient);
                await _context.SaveChangesAsync();

            }
            var inventTransact = new InventoryTransaction()
            {
                UserId = id,
                TransactionDate = DateTime.Now.Date,
                TransactionType = StockInType
            };

            _context.InventoryTransaction.Add(inventTransact);
            await _context.SaveChangesAsync();

            var inventTransactDetails = new InventoryTransactionDetail()
            {
                InventoryTransactId = inventTransact.InventoryTransactId,
                IngredientId = checkIngredient.IngredientId,
                Quantity = ingredient.Quantity,
                Remarks = "Purchased"

            };
            _context.InventoryTransactionDetail.Add(inventTransactDetails);
            await _context.SaveChangesAsync();

            TempData["StockIn"] = " ";
            return RedirectToAction("InventoryList");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StockOutIngredient(Ingredient ingredient, string StockInType, string remarks)
        {
            int id = (int)HttpContext.Session.GetInt32("UserID");
            var checkIngredient = await _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefaultAsync();
            if (checkIngredient != null)
            {
                if(checkIngredient.Quantity >= ingredient.Quantity)
                {
                    checkIngredient.Quantity -= ingredient.Quantity;
                    _context.Ingredient.Update(checkIngredient);
                    await _context.SaveChangesAsync();

                    TempData["StockOut"] = " ";

                    var inventTransact = new InventoryTransaction()
                    {
                        UserId = id,
                        TransactionDate = DateTime.Now.Date,
                        TransactionType = StockInType
                    };

                    _context.InventoryTransaction.Add(inventTransact);
                    await _context.SaveChangesAsync();

                    var inventTransactDetails = new InventoryTransactionDetail()
                    {
                        InventoryTransactId = inventTransact.InventoryTransactId,
                        IngredientId = checkIngredient.IngredientId,
                        Quantity = ingredient.Quantity,
                        Remarks = remarks

                    };
                    _context.InventoryTransactionDetail.Add(inventTransactDetails);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    TempData["Insufficient"] = " ";
                }
               

            }
         
            return RedirectToAction("InventoryList");
        }
        public IActionResult StockMovement()
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
                        var inventoryDetails = _context.InventoryTransactionDetail.Include(d => d.Ingredient).Include(s => s.InventoryTransaction).ThenInclude(x => x.User).ToList();
                        ViewData["InventoryTransactDetail"] = inventoryDetails;
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
    }
}
