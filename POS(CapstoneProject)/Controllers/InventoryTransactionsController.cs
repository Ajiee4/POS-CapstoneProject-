using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using POS_CapstoneProject_.Data;
using POS_CapstoneProject_.Models;

namespace POS_CapstoneProject_.Controllers
{
    public class InventoryTransactionsController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;

        public InventoryTransactionsController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }

        // GET: InventoryTransactions
        public async Task<IActionResult> Index()
        {
            var pOS_CapstoneProject_Context = _context.InventoryTransaction.Include(i => i.Request).Include(i => i.User);
            return View(await pOS_CapstoneProject_Context.ToListAsync());
        }

        // GET: InventoryTransactions/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryTransaction = await _context.InventoryTransaction
                .Include(i => i.Request)
                .Include(i => i.User)
                .FirstOrDefaultAsync(m => m.InventoryTransactId == id);
            if (inventoryTransaction == null)
            {
                return NotFound();
            }

            return View(inventoryTransaction);
        }

        // GET: InventoryTransactions/Create
        public IActionResult Create()
        {
            ViewData["RequestId"] = new SelectList(_context.Request, "RequestId", "Status");
            ViewData["UserId"] = new SelectList(_context.User, "UserId", "Password");
            return View();
        }

        // POST: InventoryTransactions/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("InventoryTransactId,UserId,TransactionDate,TransactionType,RequestId")] InventoryTransaction inventoryTransaction)
        {
            if (ModelState.IsValid)
            {
                _context.Add(inventoryTransaction);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["RequestId"] = new SelectList(_context.Request, "RequestId", "Status", inventoryTransaction.RequestId);
            ViewData["UserId"] = new SelectList(_context.User, "UserId", "Password", inventoryTransaction.UserId);
            return View(inventoryTransaction);
        }

        // GET: InventoryTransactions/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryTransaction = await _context.InventoryTransaction.FindAsync(id);
            if (inventoryTransaction == null)
            {
                return NotFound();
            }
            ViewData["RequestId"] = new SelectList(_context.Request, "RequestId", "Status", inventoryTransaction.RequestId);
            ViewData["UserId"] = new SelectList(_context.User, "UserId", "Password", inventoryTransaction.UserId);
            return View(inventoryTransaction);
        }

        // POST: InventoryTransactions/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("InventoryTransactId,UserId,TransactionDate,TransactionType,RequestId")] InventoryTransaction inventoryTransaction)
        {
            if (id != inventoryTransaction.InventoryTransactId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(inventoryTransaction);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!InventoryTransactionExists(inventoryTransaction.InventoryTransactId))
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
            ViewData["RequestId"] = new SelectList(_context.Request, "RequestId", "Status", inventoryTransaction.RequestId);
            ViewData["UserId"] = new SelectList(_context.User, "UserId", "Password", inventoryTransaction.UserId);
            return View(inventoryTransaction);
        }

        // GET: InventoryTransactions/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryTransaction = await _context.InventoryTransaction
                .Include(i => i.Request)
                .Include(i => i.User)
                .FirstOrDefaultAsync(m => m.InventoryTransactId == id);
            if (inventoryTransaction == null)
            {
                return NotFound();
            }

            return View(inventoryTransaction);
        }

        // POST: InventoryTransactions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var inventoryTransaction = await _context.InventoryTransaction.FindAsync(id);
            if (inventoryTransaction != null)
            {
                _context.InventoryTransaction.Remove(inventoryTransaction);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool InventoryTransactionExists(int id)
        {
            return _context.InventoryTransaction.Any(e => e.InventoryTransactId == id);
        }
    }
}
