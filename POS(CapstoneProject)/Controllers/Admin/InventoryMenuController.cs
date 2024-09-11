using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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
                        ViewData["DateNow"] = DateTime.Now.ToString("dd/mm/yyyy");
                        var ingredientsList = _context.Ingredient.OrderByDescending(s => s.Quantity).ToList();
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

                checkIngredient.LowStockThreshold = ingredient.LowStockThreshold;

                _context.Ingredient.Update(checkIngredient);
                await _context.SaveChangesAsync();

                TempData["UpdateIngredient"] = " ";
            }


            return RedirectToAction("InventoryList");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddProcess(string listData, string selectProcess, string stockOutRemarks)
        {
            int id = (int)HttpContext.Session.GetInt32("UserID");

            switch (selectProcess)
            {
                case "Request":
                    await AddRequest(listData, id);
                    TempData["AddRequest"] = " ";
                    break;
                case "Stock In":
                    await StockIn(listData, id);
                    TempData["StockIn"] = " ";
                    break;
                case "Stock Out":
                    await StockOut(listData, id, stockOutRemarks);
                    TempData["StockOut"] = " ";
                    break;
            }
            return RedirectToAction("InventoryList");
        }
        public async Task AddRequest(string data, int id)
        {
            var myList = JsonConvert.DeserializeObject<List<IngredientList>>(data);


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
        public async Task StockIn(string data, int id)
        {
            var myList = JsonConvert.DeserializeObject<List<IngredientList>>(data);
            if (myList! != null)
            {
                foreach (var item in myList)
                {
                    var ingredient = await _context.Ingredient.Where(s => s.IngredientId == item.ingredientId).FirstOrDefaultAsync();
                    if (ingredient != null)
                    {
                        ingredient.Quantity += item.ingredientQty;
                        _context.Ingredient.Update(ingredient);
                    }

                    await _context.SaveChangesAsync();
                }

            }

            var inventTransact = new InventoryTransaction()
            {
                UserId = id,
                TransactionDate = DateTime.Now.Date,
                TransactionType = "Stock In"
            };


            await _context.InventoryTransaction.AddAsync(inventTransact);
            await _context.SaveChangesAsync();


            if (myList! != null)
            {
                foreach (var item in myList)
                {
                    if (item.ingredientQty > 0)
                    {
                        var inventDetails = new InventoryTransactionDetail()
                        {
                            InventoryTransactId = inventTransact.InventoryTransactId,
                            IngredientId = item.ingredientId,
                            Quantity = item.ingredientQty,
                            Remarks = "Delivered"

                        };
                        await _context.InventoryTransactionDetail.AddAsync(inventDetails);
                    }

                }

                await _context.SaveChangesAsync();
            }
        }

       
        public async Task StockOut(string data, int id, string remarks)
        {
            var myList = JsonConvert.DeserializeObject<List<IngredientList>>(data);
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
                        var inventDetails = new InventoryTransactionDetail()
                        {
                            InventoryTransactId = inventTransact.InventoryTransactId,
                            IngredientId = item.ingredientId,
                            Quantity = item.ingredientQty,
                            Remarks = remarks

                        };
                        await _context.InventoryTransactionDetail.AddAsync(inventDetails);
                    }

                }

                await _context.SaveChangesAsync();
            }
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

            var inventTransact = new InventoryTransaction()
            {
                UserId = userId,
                TransactionDate = DateTime.Now.Date,
                TransactionType = "Stock In"
            };


            await _context.InventoryTransaction.AddAsync(inventTransact);
            await _context.SaveChangesAsync();
            //add transaction details and save to db

          

            if (myList! != null)
            {
                foreach (var item in myList)
                {
                    if(item.Quantity > 0)
                    {
                        var inventDetails = new InventoryTransactionDetail()
                        {
                            InventoryTransactId = inventTransact.InventoryTransactId,
                            IngredientId = item.IngredientId,
                            Quantity = item.Quantity,
                            Remarks = "Delivered"

                        };
                        await _context.InventoryTransactionDetail.AddAsync(inventDetails);
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

        //[HttpPost]
        //[ValidateAntiForgeryToken]  
        //public async Task<IActionResult> StockInIngredient(Ingredient ingredient, string StockInType)
        //{   
        ////    //get and store the use rid
        ////    int id = (int)HttpContext.Session.GetInt32("UserID");
        ////    //check the id if it exist
        ////    var checkIngredient = await _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefaultAsync();
        ////    if (checkIngredient != null)
        ////    {
        ////        //update the quantity of ingredient
        ////        checkIngredient.Quantity += ingredient.Quantity;
        ////        _context.Ingredient.Update(checkIngredient);
        ////        await _context.SaveChangesAsync();

        ////    }
        ////    //add new inventory transaction and save to db
        ////    var inventTransact = new InventoryTransaction()
        ////    {
        ////        UserId = id,
        ////        TransactionDate = DateTime.Now.Date,
        ////        TransactionType = StockInType
        ////    };

        ////    _context.InventoryTransaction.Add(inventTransact);
        ////    await _context.SaveChangesAsync();
        ////    //add transaction details and save to db
        ////    var inventTransactDetails = new InventoryTransactionDetail()
        ////    {
        ////        InventoryTransactId = inventTransact.InventoryTransactId,
        ////        IngredientId = checkIngredient.IngredientId,
        ////        Quantity = ingredient.Quantity,
        ////        Remarks = "Purchased"

        ////    };

        //    _context.InventoryTransactionDetail.Add(inventTransactDetails);
        //    await _context.SaveChangesAsync();

        //    TempData["StockIn"] = " ";

        //    return RedirectToAction("InventoryList");
        //}
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> StockOutIngredient(Ingredient ingredient, string StockInType, string remarks)
        //{
        //    //get and store the user id
        //    int id = (int)HttpContext.Session.GetInt32("UserID");
        //    //check the id of the ingredient if it exist
        //    var checkIngredient = await _context.Ingredient.Where(s => s.IngredientId == ingredient.IngredientId).FirstOrDefaultAsync();
        //    if (checkIngredient != null)
        //    {
        //        //check if the quantity is greaten than the input quanty
        //        if (checkIngredient.Quantity >= ingredient.Quantity)
        //        {
        //            //update the records
        //            checkIngredient.Quantity -= ingredient.Quantity;
        //            _context.Ingredient.Update(checkIngredient);
        //            await _context.SaveChangesAsync();

        //            TempData["StockOut"] = " ";

        //            //add new inventory transaction
        //            var inventTransact = new InventoryTransaction()
        //            {
        //                UserId = id,
        //                TransactionDate = DateTime.Now.Date,
        //                TransactionType = StockInType
        //            };

        //            _context.InventoryTransaction.Add(inventTransact);
        //            await _context.SaveChangesAsync();

        //            //add inventory transaction details
        //            var inventTransactDetails = new InventoryTransactionDetail()
        //            {
        //                InventoryTransactId = inventTransact.InventoryTransactId,
        //                IngredientId = checkIngredient.IngredientId,
        //                Quantity = ingredient.Quantity,
        //                Remarks = remarks

        //            };
        //            _context.InventoryTransactionDetail.Add(inventTransactDetails);
        //            await _context.SaveChangesAsync();

        //        }
        //        else
        //        {
        //            TempData["Insufficient"] = " ";
        //        }


        //    }

        //    return RedirectToAction("InventoryList");
        //}
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
                        HttpContext.Session.Clear();
                        return RedirectToAction("Login", "Authentication");
                    }
                    else
                    {
                        //var requestList = _context.Request.Include(s );
                        var requesComplete = _context.Request.Include(s => s.User).Where(s => s.Status == "Completed").ToList();
                        var requesPending = _context.Request.Include(s => s.User).Where(s => s.Status == "Pending").ToList();
                        var requesCanceled = _context.Request.Include(s => s.User).Where(s => s.Status == "Canceled").ToList();
                        var requestDetails = _context.RequestDetails.Include(s => s.Ingredient).ToList();
                        ViewData["RequestComplete"] = requesComplete;
                        ViewData["RequestPending"] = requesPending;
                        ViewData["RequestCanceled"] = requesCanceled;
                        ViewData["RequestDetails"] = JsonConvert.SerializeObject(requestDetails);

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
