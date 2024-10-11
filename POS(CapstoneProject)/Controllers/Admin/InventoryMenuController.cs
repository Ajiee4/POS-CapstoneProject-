using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.DTO;
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
                        //HttpContext.Session.Clear();


                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {
                        ViewData["DateNow"] = DateTime.Now.ToString("dd/mm/yyyy");
                        var ingredientsList = _context.Ingredient.OrderBy(s => s.IngredientId).ToList();
                        var requestList = _context.RequestDetails.Include(s => s.Request).ToList();
                        ViewData["IngredientsList"] = ingredientsList;
                        ViewData["RequestList"] = requestList;
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

        //From Inventory List
        //Adding new Ingredient
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddIngredient(Ingredient ingredient)
        {
            //check the ingredients if it exist
            var checkIngredients = _context.Ingredient.Where(s => s.Name == ingredient.Name).FirstOrDefault();

            if (checkIngredients != null)
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

                    LowStockThreshold = ingredient.LowStockThreshold
                };

                await _context.Ingredient.AddAsync(newIngredient);
                await _context.SaveChangesAsync();
                TempData["AddIngredient"] = " ";
            }

            return RedirectToAction("InventoryList");
        }

        //From Inventory List
        //Updating the Inventory
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateIngredient(Ingredient ingredient)
        {
            //check if the ingredient already exist
            var checkIngredient = _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefault();
            if (checkIngredient != null)
            {

                if(checkIngredient.Name == ingredient.Name && checkIngredient.UnitOfMeasurement == ingredient.UnitOfMeasurement
                    && checkIngredient.LowStockThreshold == ingredient.LowStockThreshold)
                {
                    TempData["NoChanges"] = " ";
                }
                else
                {
                    checkIngredient.Name = ingredient.Name;
                    checkIngredient.UnitOfMeasurement = ingredient.UnitOfMeasurement;

                    checkIngredient.LowStockThreshold = ingredient.LowStockThreshold;

                    _context.Ingredient.Update(checkIngredient);
                    await _context.SaveChangesAsync();

                    TempData["UpdateIngredient"] = " ";
                }
                //update the ingredient
            
            }


            return RedirectToAction("InventoryList");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddRequest(string requestData)
        {
            int id = (int)HttpContext.Session.GetInt32("UserID");
            var myList = JsonConvert.DeserializeObject<List<IngredientList>>(requestData);


            Request req = new Request()
            {
                UserId = id,
                RequestDate = DateTime.Now.Date,
                Status = "Pending"
            };

            await _context.Request.AddAsync(req);
            await _context.SaveChangesAsync();

            if (myList! != null)
            {
                foreach (var item in myList)
                {
                    RequestDetails details = new RequestDetails
                    {
                        RequestId = req.RequestId,
                        IngredientId = item.ingredientId,
                        Quantity = item.ingredientQty,
                    };

                    await _context.RequestDetails.AddAsync(details);
                }
                await _context.SaveChangesAsync();
            }
            TempData["AddRequest"] = "Request Complete";

            return RedirectToAction("InventoryList");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateRequest(string requestData, int requestId)
        {
            int userId = (int)HttpContext.Session.GetInt32("UserID");
            var checkRequest = await _context.Request.Where(s => s.RequestId == requestId).FirstOrDefaultAsync();
            if (checkRequest != null)
            {
                checkRequest.Status = "Completed";


                _context.Request.Update(checkRequest);
                await _context.SaveChangesAsync();
            }
            var myList = JsonConvert.DeserializeObject<List<RequestListUpdated>>(requestData);

         

            var inventTransact = new InventoryTransaction()
            {
                UserId = userId,
                TransactionDate = DateTime.Now.Date,
                TransactionType = "Stock In",
                RequestId = requestId,
            };


            await _context.InventoryTransaction.AddAsync(inventTransact);
            await _context.SaveChangesAsync();



            if (myList! != null)
            {
                foreach (var item in myList)
                {
                    if (item.Quantity > 0)
                    {
                        var ingredient = await _context.Ingredient.Where(s => s.IngredientId == item.IngredientId).FirstOrDefaultAsync();
                        var inventDetails = new InventoryTransactionDetail()
                        {
                            InventoryTransactId = inventTransact.InventoryTransactId,
                            IngredientId = item.IngredientId,
                            Quantity = $"{ingredient.Quantity} + {item.Quantity}",
                            Remarks = "Delivered"

                        };
                        await _context.InventoryTransactionDetail.AddAsync(inventDetails);
                    }

                }

                await _context.SaveChangesAsync();
            }

            if (myList! != null)
            {
                foreach (var item in myList)
                {
                    var ingredient = _context.Ingredient.Where(s => s.IngredientId == item.IngredientId).FirstOrDefault();
                    if (ingredient != null)
                    {
                        ingredient.Quantity += item.Quantity;
                        _context.Ingredient.Update(ingredient);
                    }
                }
                await _context.SaveChangesAsync();
            }

            TempData["UpdateRequest"] = "Request Complete";
            return RedirectToAction("RequestList");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CancelRequest(int requestId)
        {
            int userId = (int)HttpContext.Session.GetInt32("UserID");
            var checkRequest = await _context.Request.Where(s => s.RequestId == requestId).FirstOrDefaultAsync();
            if (checkRequest != null)
            {
                checkRequest.Status = "Canceled";


                _context.Request.Update(checkRequest);
                await _context.SaveChangesAsync();
            }

            TempData["CancelRequest"] = "Request Canceled";

            return RedirectToAction("RequestList");
        }

        public async Task<IActionResult> StockOut(string stockOutData, string remarks)
        {
            int id = (int)HttpContext.Session.GetInt32("UserID");
            var myList = JsonConvert.DeserializeObject<List<IngredientList>>(stockOutData);
           

            var inventTransact = new InventoryTransaction()
            {
                UserId = id,
                TransactionDate = DateTime.Now.Date,
                TransactionType = "Stock Out"
            };


            await _context.InventoryTransaction.AddAsync(inventTransact);
            await _context.SaveChangesAsync();


            if (myList! != null)
            {
                foreach (var item in myList)
                {
                    if (item.ingredientQty > 0)
                    {
                        var ingredient = await _context.Ingredient.Where(s => s.IngredientId == item.ingredientId).FirstOrDefaultAsync();
                        var inventDetails = new InventoryTransactionDetail()
                        {
                            InventoryTransactId = inventTransact.InventoryTransactId,
                            IngredientId = item.ingredientId,
                            Quantity = $"{ingredient.Quantity} - {item.ingredientQty}",
                            Remarks = remarks

                        };
                        await _context.InventoryTransactionDetail.AddAsync(inventDetails);
                    }

                }

                await _context.SaveChangesAsync();
            }

            if (myList! != null)
            {
                foreach (var item in myList)
                {
                    var ingredient = await _context.Ingredient.Where(s => s.IngredientId == item.ingredientId).FirstOrDefaultAsync();
                    if (ingredient != null)
                    {

                        ingredient.Quantity -= item.ingredientQty;
                        _context.Ingredient.Update(ingredient);

                    }

                    await _context.SaveChangesAsync();
                }

            }
            TempData["StockOut"] = " ";
            return RedirectToAction("InventoryList");
        }

        public async Task<IActionResult> StockMovement()
        {
            //check if there's an ongoing session
            var UserId = HttpContext.Session.GetInt32("UserID");
            if (UserId != null)
            {

                var check = await _context.User.Where(s => s.UserId == UserId).FirstOrDefaultAsync();
                if (check != null)
                {
                    if (check.RoleId != 1)
                    {
                        //HttpContext.Session.Clear();
                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {                       
                    
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
        public async Task<IActionResult> StockMovement(string transactionType, DateTime fromDate, DateTime toDate)
        {

            var inventoryList = await _context.InventoryTransactionDetail
                                    .Include(d => d.Ingredient)
                                    .Include(s => s.InventoryTransaction)
                                    .ThenInclude(x => x.User)
                                    .Where(s => s.InventoryTransaction.TransactionDate >= fromDate && s.InventoryTransaction.TransactionDate <= toDate)
                                    .ToListAsync();

            

        
            switch (transactionType)
            {
                case "All":
                    ViewData["inventoryAll"] = JsonConvert.SerializeObject(inventoryList);
                    break;
                case "Stock In":
                    ViewData["inventoryStockIn"] = JsonConvert.SerializeObject(inventoryList);
                    break;
                case "Stock Out":
                    ViewData["inventoryStockOut"] = JsonConvert.SerializeObject(inventoryList);
                    break;
            }

            return View();
        } 
      
        public IActionResult RequestList()
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
                        //HttpContext.Session.Clear();
                        return RedirectToAction("Index", "Sales");
                    }
                    else
                    {
                    
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
        public IActionResult RequestList(string requestStatus, DateTime fromDate, DateTime toDate)
        {
            var RequestList = _context.Request
                                .Include(s => s.User)
                                .Where(s => s.RequestDate >= fromDate && s.RequestDate <= toDate)
                                .ToList();

           
            var requestDetails = _context.RequestDetails
                                .Include(s => s.Ingredient)
                                .ToList();



            ViewData["RequestDetails"] = JsonConvert.SerializeObject(requestDetails);
            switch (requestStatus)
            {
                case "Pending":

                    ViewData["RequestPending"] = JsonConvert.SerializeObject(RequestList);
                    break;
                case "Completed":

                    ViewData["RequestCompleted"] = JsonConvert.SerializeObject(RequestList);
                   
                    break;
                case "Canceled":
                    ViewData["RequestCanceled"] = JsonConvert.SerializeObject(RequestList);
                  
                    break;
            };

         
            return View();
        }

       
    }
}
