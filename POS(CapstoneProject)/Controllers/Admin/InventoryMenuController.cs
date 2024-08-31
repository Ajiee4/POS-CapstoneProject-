﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers.Admin
{
    public class InventoryMenuController : Controller
    {
        //db context
        private readonly POS_CapstoneProject_Context _context;

        //constructor
        public InventoryMenuController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }
        public IActionResult InventoryList()
        {
            //get and store the session
            var UserId = HttpContext.Session.GetInt32("UserID");
            //check if there's an ongoing session
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
        public async Task<IActionResult> AddIngredient(Ingredient ingredient)
        {
            //check the ingredients if it exist
            var checkIngredients = _context.Ingredient.Where(s => s.Name == ingredient.Name).FirstOrDefault();

            if(checkIngredients != null)
            {
                TempData["Exist"] = " ";
            }
            else
            {
                //store the new ingredients in the database
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
            }
          
            return RedirectToAction("InventoryList");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateIngredient(Ingredient ingredient)
        {
            //check if the ingredient already exist
            var checkIngredient = _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefault();
            if (checkIngredient != null)
            {
                //update the ingredient
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
            //get and store the use rid
            int id = (int)HttpContext.Session.GetInt32("UserID");
            //check the id if it exist
            var checkIngredient = await _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefaultAsync();
            if (checkIngredient != null)
            {
                //update the quantity of ingredient
                checkIngredient.Quantity += ingredient.Quantity;
                _context.Ingredient.Update(checkIngredient);
                await _context.SaveChangesAsync();

            }
            //add new inventory transaction and save to db
            var inventTransact = new InventoryTransaction()
            {
                UserId = id,
                TransactionDate = DateTime.Now.Date,
                TransactionType = StockInType
            };

            _context.InventoryTransaction.Add(inventTransact);
            await _context.SaveChangesAsync();
            //add transaction details and save to db
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
            //get and store the user id
            int id = (int)HttpContext.Session.GetInt32("UserID");
            //check the id of the ingredient if it exist
            var checkIngredient = await _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefaultAsync();
            if (checkIngredient != null)
            {
                //check if the quantity is greaten than the input quanty
                if (checkIngredient.Quantity >= ingredient.Quantity)
                {
                    //update the records
                    checkIngredient.Quantity -= ingredient.Quantity;
                    _context.Ingredient.Update(checkIngredient);
                    await _context.SaveChangesAsync();

                    TempData["StockOut"] = " ";

                    //add new inventory transaction
                    var inventTransact = new InventoryTransaction()
                    {
                        UserId = id,
                        TransactionDate = DateTime.Now.Date,
                        TransactionType = StockInType
                    };

                    _context.InventoryTransaction.Add(inventTransact);
                    await _context.SaveChangesAsync();

                    //add inventory transaction details
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
            //check if there's an ongoing session
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
