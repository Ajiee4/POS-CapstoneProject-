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

        public async Task GetData()
        {
            ViewData["DateNow"] = DateTime.Now.ToString("dd/mm/yyyy");

            var ingredientsList = await _context.Ingredient
                                                .OrderBy(s => s.IngredientId)
                                                .ToListAsync();

            var requestList = await _context.RequestDetails
                                            .Include(s => s.Request)
                                            .ToListAsync();

            ViewData["IngredientsList"] = ingredientsList;
            ViewData["RequestList"] = requestList;
        }

        //Inventory List
        public async Task<IActionResult> InventoryList()
        {
            //get and store the session
            var UserId = HttpContext.Session.GetInt32("UserID");
            //check if there's an ongoing session
            if (UserId != null)
            {
                var check = await _context.User
                                           .Where(s => s.UserId == UserId)
                                          .FirstOrDefaultAsync();

                if (check != null)
                {
                    if (check.RoleId != 1)
                    {
                        //HttpContext.Session.Clear();


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

        
        //Adding new Ingredient
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddIngredient(Ingredient ingredient)
        {

            try
            {
                //check the ingredients if it exist
                var checkIngredients = await _context.Ingredient
                                                     .Where(s => s.Name == ingredient.Name)
                                                     .FirstOrDefaultAsync();

                if (checkIngredients != null)
                {
                    ViewData["Exist"] = " ";
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

                    ViewData["AddIngredient"] = " ";
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



            return View("InventoryList");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateIngredient(Ingredient ingredient)
        {
            try
            {
                //check if the ingredient already exist
                var checkIngredient = await _context.Ingredient
                                                    .Where(s => s.IngredientId == ingredient.IngredientId)
                                                    .FirstOrDefaultAsync();

                if (checkIngredient != null)
                {

                    if (checkIngredient.Name == ingredient.Name && checkIngredient.UnitOfMeasurement == ingredient.UnitOfMeasurement
                        && checkIngredient.LowStockThreshold == ingredient.LowStockThreshold)
                    {
                        ViewData["NoChanges"] = " ";
                    }
                    else
                    {
                        var checkIngredients = await _context.Ingredient
                                                   .Where(s => s.Name == ingredient.Name && s.IngredientId != ingredient.IngredientId)
                                                   .FirstOrDefaultAsync();

                        if (checkIngredients != null)
                        {
                            ViewData["Exist"] = " ";
                        }
                        else
                        {
                            checkIngredient.Name = ingredient.Name;
                            checkIngredient.UnitOfMeasurement = ingredient.UnitOfMeasurement;
                            checkIngredient.LowStockThreshold = ingredient.LowStockThreshold;

                            _context.Ingredient.Update(checkIngredient);
                            await _context.SaveChangesAsync();

                            ViewData["UpdateIngredient"] = " ";

                        }
                        
                    }

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

            return View("InventoryList");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddRequest(string requestData)
        {
            try
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
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
            finally
            {
                await GetData();
            }


            ViewData["AddRequest"] = "Request Complete";

            return View("InventoryList");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StockOut(string stockOutData, string remarks)
        {
            try
            {
                int id = (int)HttpContext.Session.GetInt32("UserID");
                var myList = JsonConvert.DeserializeObject<List<IngredientList>>(stockOutData);

                var inventTransact = new InventoryTransaction()
                {
                    UserId = id,
                    TransactionDate = DateTime.Now.Date,
                    TransactionType = "Stock Out",
                    Remarks = remarks,
                };

                await _context.InventoryTransaction.AddAsync(inventTransact);
                await _context.SaveChangesAsync();


                if (myList! != null)
                {
                    foreach (var item in myList)
                    {
                        if (item.ingredientQty > 0)
                        {
                            var ingredient = await _context.Ingredient
                                                           .Where(s => s.IngredientId == item.ingredientId)
                                                           .FirstOrDefaultAsync();

                            var inventDetails = new InventoryTransactionDetail()
                            {
                                InventoryTransactId = inventTransact.InventoryTransactId,
                                IngredientId = item.ingredientId,
                                Quantity = $"- {item.ingredientQty}",
                                QtyOnHand = ingredient.Quantity,
                                UpdatedQty = ingredient.Quantity - item.ingredientQty,
                                //RemainingStock = ingredient.Quantity - item.ingredientQty,
                                //Remarks = remarks

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
                        var ingredient = await _context.Ingredient
                                                       .Where(s => s.IngredientId == item.ingredientId)
                                                       .FirstOrDefaultAsync();

                        if (ingredient != null)
                        {

                            ingredient.Quantity -= item.ingredientQty;
                            _context.Ingredient.Update(ingredient);

                        }

                        await _context.SaveChangesAsync();
                    }

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


            ViewData["StockOut"] = " ";

            return View("InventoryList");
        }

        //Request List Page
        public async Task<IActionResult> RequestList()
        {
            //get and store the session
            var UserId = HttpContext.Session.GetInt32("UserID");
            //check if there's an ongoing session
            if (UserId != null)
            {
                var check = await _context.User
                    .Where(s => s.UserId == UserId)
                    .FirstOrDefaultAsync();

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
        public async Task<IActionResult> FilterRequest(string requestStatus, DateTime fromDate, DateTime toDate)
        {
            var RequestList = await _context.Request
                                            .Include(s => s.User)
                                            .Where(s => s.RequestDate >= fromDate && s.RequestDate <= toDate && s.Status == requestStatus)
                                            .ToListAsync();


            var requestDetails = await _context.RequestDetails
                                               .Include(s => s.Ingredient)
                                               .ToListAsync();



            ViewData["RequestDetails"] = JsonConvert.SerializeObject(requestDetails);
            ViewData["FilterType"] = requestStatus;
            ViewData["RequestList"] = JsonConvert.SerializeObject(RequestList);

            return View("RequestList");
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateRequest(string requestData, int requestId)
        {
            try
            {
                int userId = (int)HttpContext.Session.GetInt32("UserID");
                var checkRequest = await _context.Request
                                                 .Where(s => s.RequestId == requestId)
                                                 .FirstOrDefaultAsync();

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
                    Remarks = "Delivered"
                };

                await _context.InventoryTransaction.AddAsync(inventTransact);
                await _context.SaveChangesAsync();

                if (myList! != null)
                {
                    foreach (var item in myList)
                    {
                        if (item.Quantity > 0)
                        {
                            var ingredient = await _context.Ingredient
                                                    .Where(s => s.IngredientId == item.IngredientId)
                                                    .FirstOrDefaultAsync();

                            var inventDetails = new InventoryTransactionDetail()
                            {
                                InventoryTransactId = inventTransact.InventoryTransactId,
                                IngredientId = item.IngredientId,
                                Quantity = $"+ {item.Quantity}",
                                QtyOnHand = ingredient.Quantity,
                                UpdatedQty = ingredient.Quantity + item.Quantity,
                                //RemainingStock = ingredient.Quantity + item.Quantity,
                                //Remarks = "Delivered"

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
                        var ingredient = await _context.Ingredient
                                        .Where(s => s.IngredientId == item.IngredientId)
                                        .FirstOrDefaultAsync();
                        if (ingredient != null)
                        {
                            ingredient.Quantity += item.Quantity;
                            _context.Ingredient.Update(ingredient);
                        }
                    }
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
          


            ViewData["UpdateRequest"] = "Request Complete";

            return View("RequestList");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CancelRequest(int requestId)
        {
            try
            {
                int userId = (int)HttpContext.Session.GetInt32("UserID");
                var checkRequest = await _context.Request
                                        .Where(s => s.RequestId == requestId)
                                        .FirstOrDefaultAsync();

                if (checkRequest != null)
                {
                    checkRequest.Status = "Canceled";


                    _context.Request.Update(checkRequest);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }

            ViewData["CancelRequest"] = "Request Canceled";

            return View("RequestList");
        }
     
        //Stock Movement Page
        public async Task<IActionResult> StockMovement()
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
        public async Task<IActionResult> FilterType(string transactionType, DateTime fromDate, DateTime toDate)
        {

            try
            {
                var stockMovementDetails = await _context.InventoryTransactionDetail
                                 .Include(d => d.Ingredient)
                                 .Include(s => s.InventoryTransaction)
                                 .ThenInclude(x => x.User)
                                 .Where(s => s.InventoryTransaction.TransactionDate >= fromDate && s.InventoryTransaction.TransactionDate <= toDate)
                                 .ToListAsync();
                var stockMovementList = await _context.InventoryTransaction
                                        .Include(s => s.User)
                                        .Where(s => s.TransactionDate >= fromDate && s.TransactionDate <= toDate)
                                        .ToListAsync();




                switch (transactionType)
                {

                    case "Stock In":
                        var stockInList = stockMovementList.Where(s => s.TransactionType == transactionType);
                        ViewData["StockMovementList"] = JsonConvert.SerializeObject(stockInList);
                        break;
                    case "Stock Out":
                        var stockOutList = stockMovementList.Where(s => s.TransactionType == transactionType);
                        ViewData["StockMovementList"] = JsonConvert.SerializeObject(stockOutList);
                        break;
                    default:
                        ViewData["StockMovementList"] = JsonConvert.SerializeObject(stockMovementList);
                        break;
                }

                ViewData["stockMovementDetails"] = JsonConvert.SerializeObject(stockMovementDetails);
                ViewData["Type"] = transactionType;
            }
            catch (Exception e)
            {
                ViewData["Error"] = e.Message;
            }
            
            return View("StockMovement");
        } 
      
    
       
    }
}
