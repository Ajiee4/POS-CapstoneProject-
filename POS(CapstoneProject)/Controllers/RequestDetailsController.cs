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
    public class RequestDetailsController : Controller
    {
        private readonly POS_CapstoneProject_Context _context;

        public RequestDetailsController(POS_CapstoneProject_Context context)
        {
            _context = context;
        }

        // GET: RequestDetails
        public async Task<IActionResult> Index()
        {
            var pOS_CapstoneProject_Context = _context.RequestDetails.Include(r => r.Ingredient).Include(r => r.Request);
            return View(await pOS_CapstoneProject_Context.ToListAsync());
        }

        // GET: RequestDetails/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var requestDetails = await _context.RequestDetails
                .Include(r => r.Ingredient)
                .Include(r => r.Request)
                .FirstOrDefaultAsync(m => m.RequestDetailsId == id);
            if (requestDetails == null)
            {
                return NotFound();
            }

            return View(requestDetails);
        }

        // GET: RequestDetails/Create
        public IActionResult Create()
        {
            ViewData["IngredientId"] = new SelectList(_context.Ingredient, "IngredientId", "Name");
            ViewData["RequestId"] = new SelectList(_context.Request, "RequestId", "Status");
            return View();
        }

        // POST: RequestDetails/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("RequestDetailsId,RequestId,IngredientId,Quantity")] RequestDetails requestDetails)
        {
            if (ModelState.IsValid)
            {
                _context.Add(requestDetails);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IngredientId"] = new SelectList(_context.Ingredient, "IngredientId", "Name", requestDetails.IngredientId);
            ViewData["RequestId"] = new SelectList(_context.Request, "RequestId", "Status", requestDetails.RequestId);
            return View(requestDetails);
        }

        // GET: RequestDetails/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var requestDetails = await _context.RequestDetails.FindAsync(id);
            if (requestDetails == null)
            {
                return NotFound();
            }
            ViewData["IngredientId"] = new SelectList(_context.Ingredient, "IngredientId", "Name", requestDetails.IngredientId);
            ViewData["RequestId"] = new SelectList(_context.Request, "RequestId", "Status", requestDetails.RequestId);
            return View(requestDetails);
        }

        // POST: RequestDetails/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("RequestDetailsId,RequestId,IngredientId,Quantity")] RequestDetails requestDetails)
        {
            if (id != requestDetails.RequestDetailsId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(requestDetails);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RequestDetailsExists(requestDetails.RequestDetailsId))
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
            ViewData["IngredientId"] = new SelectList(_context.Ingredient, "IngredientId", "Name", requestDetails.IngredientId);
            ViewData["RequestId"] = new SelectList(_context.Request, "RequestId", "Status", requestDetails.RequestId);
            return View(requestDetails);
        }

        // GET: RequestDetails/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var requestDetails = await _context.RequestDetails
                .Include(r => r.Ingredient)
                .Include(r => r.Request)
                .FirstOrDefaultAsync(m => m.RequestDetailsId == id);
            if (requestDetails == null)
            {
                return NotFound();
            }

            return View(requestDetails);
        }

        // POST: RequestDetails/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var requestDetails = await _context.RequestDetails.FindAsync(id);
            if (requestDetails != null)
            {
                _context.RequestDetails.Remove(requestDetails);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RequestDetailsExists(int id)
        {
            return _context.RequestDetails.Any(e => e.RequestDetailsId == id);
        }
    }
}
