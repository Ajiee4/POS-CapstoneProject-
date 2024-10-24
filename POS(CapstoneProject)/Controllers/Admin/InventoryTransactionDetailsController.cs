using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers.Admin
{
    public class InventoryTransactionDetailsController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;

        public InventoryTransactionDetailsController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }

        // GET: InventoryTransactionDetails
        public async Task<IActionResult> Index()
        {
            var pOS_CapstoneProject_Context = _context.InventoryTransactionDetail.Include(i => i.Ingredient).Include(i => i.InventoryTransaction);
            return View(await pOS_CapstoneProject_Context.ToListAsync());
        }

        // GET: InventoryTransactionDetails/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryTransactionDetail = await _context.InventoryTransactionDetail
                .Include(i => i.Ingredient)
                .Include(i => i.InventoryTransaction)
                .FirstOrDefaultAsync(m => m.InventoryTransactDetailId == id);
            if (inventoryTransactionDetail == null)
            {
                return NotFound();
            }

            return View(inventoryTransactionDetail);
        }

        // GET: InventoryTransactionDetails/Create
        public IActionResult Create()
        {
            ViewData["IngredientId"] = new SelectList(_context.Ingredient, "IngredientId", "Name");
            ViewData["InventoryTransactId"] = new SelectList(_context.InventoryTransaction, "InventoryTransactId", "TransactionType");
            return View();
        }

        // POST: InventoryTransactionDetails/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("InventoryTransactDetailId,InventoryTransactId,IngredientId,Quantity,Remarks,RemainingStock")] InventoryTransactionDetail inventoryTransactionDetail)
        {
            if (ModelState.IsValid)
            {
                _context.Add(inventoryTransactionDetail);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IngredientId"] = new SelectList(_context.Ingredient, "IngredientId", "Name", inventoryTransactionDetail.IngredientId);
            ViewData["InventoryTransactId"] = new SelectList(_context.InventoryTransaction, "InventoryTransactId", "TransactionType", inventoryTransactionDetail.InventoryTransactId);
            return View(inventoryTransactionDetail);
        }

        // GET: InventoryTransactionDetails/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryTransactionDetail = await _context.InventoryTransactionDetail.FindAsync(id);
            if (inventoryTransactionDetail == null)
            {
                return NotFound();
            }
            ViewData["IngredientId"] = new SelectList(_context.Ingredient, "IngredientId", "Name", inventoryTransactionDetail.IngredientId);
            ViewData["InventoryTransactId"] = new SelectList(_context.InventoryTransaction, "InventoryTransactId", "TransactionType", inventoryTransactionDetail.InventoryTransactId);
            return View(inventoryTransactionDetail);
        }

        // POST: InventoryTransactionDetails/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("InventoryTransactDetailId,InventoryTransactId,IngredientId,Quantity,Remarks,RemainingStock")] InventoryTransactionDetail inventoryTransactionDetail)
        {
            if (id != inventoryTransactionDetail.InventoryTransactDetailId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(inventoryTransactionDetail);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!InventoryTransactionDetailExists(inventoryTransactionDetail.InventoryTransactDetailId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["IngredientId"] = new SelectList(_context.Ingredient, "IngredientId", "Name", inventoryTransactionDetail.IngredientId);
            ViewData["InventoryTransactId"] = new SelectList(_context.InventoryTransaction, "InventoryTransactId", "TransactionType", inventoryTransactionDetail.InventoryTransactId);
            return View(inventoryTransactionDetail);
        }

        // GET: InventoryTransactionDetails/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryTransactionDetail = await _context.InventoryTransactionDetail
                .Include(i => i.Ingredient)
                .Include(i => i.InventoryTransaction)
                .FirstOrDefaultAsync(m => m.InventoryTransactDetailId == id);
            if (inventoryTransactionDetail == null)
            {
                return NotFound();
            }

            return View(inventoryTransactionDetail);
        }

        // POST: InventoryTransactionDetails/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var inventoryTransactionDetail = await _context.InventoryTransactionDetail.FindAsync(id);
            if (inventoryTransactionDetail != null)
            {
                _context.InventoryTransactionDetail.Remove(inventoryTransactionDetail);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool InventoryTransactionDetailExists(int id)
        {
            return _context.InventoryTransactionDetail.Any(e => e.InventoryTransactDetailId == id);
        }
    }
}
