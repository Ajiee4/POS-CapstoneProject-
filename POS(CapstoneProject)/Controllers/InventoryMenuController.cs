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
            var ingredientsList = _context.Ingredient.ToList();
            ViewData["IngredientsList"] = ingredientsList;
            return View();
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
            var checkIngredient = await _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefaultAsync();
            if(checkIngredient != null)
            {
                checkIngredient.Quantity += ingredient.Quantity;
                _context.Ingredient.Update(checkIngredient);
                await _context.SaveChangesAsync();

            }
            var inventTransact = new InventoryTransaction()
            {
                UserId = 1,
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
                        UserId = 1,
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
            var inventoryDetails = _context.InventoryTransactionDetail.Include(d => d.Ingredient).Include(s => s.InventoryTransaction).ThenInclude(x => x.User).ToList();
            ViewData["InventoryTransactDetail"] = inventoryDetails;
            return View();
        }
    }
}
