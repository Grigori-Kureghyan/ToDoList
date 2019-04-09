using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ToDo.Data;
using ToDo.Models;

namespace ToDo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ToDoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all ToDo List
        [HttpGet]
        public IEnumerable<ToDoItem> Index()
        {
            return _context.ToDoItems;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetToDoItem(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var toDoItem = await _context.ToDoItems.SingleOrDefaultAsync(m => m.ID == id);

            if (toDoItem == null)
            {
                return NotFound();
            }

            return Ok(toDoItem);
        }

        // Create new task in toDo list
        [HttpPost]
        public async Task<IActionResult> CreateToDoItem([FromBody] ToDoItem toDoItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ToDoItems.Add(toDoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetToDoItem),
                new { id = toDoItem.ID },
                toDoItem);
        }

        // Update task from ToDo List
        [HttpPut]
        public async Task<IActionResult> UpdateToDoItem([FromBody] ToDoItem toDoItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            _context.Entry(toDoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                return Ok(toDoItem);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
        }

        // Delete task from ToDo List
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDoItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var toDoItem = await _context.ToDoItems.SingleOrDefaultAsync(m => m.ID == id);
            if (toDoItem == null)
            {
                return NotFound();
            }

            _context.ToDoItems.Remove(toDoItem);
            await _context.SaveChangesAsync();

            return Ok(toDoItem);
        }

        //Delete selected tasks from ToDo List
        [HttpPost]
        [Route("DeleteSelectedItems")]
        public async Task<IActionResult> DeleteMultipleRow([FromBody]  dynamic toDoItems)
        {            
            List<ToDoItem> todoItems = JsonConvert.DeserializeObject<List<ToDoItem>>(toDoItems.ToString());
            if (toDoItems == null)
            {
                return BadRequest();
            }
            _context.ToDoItems.RemoveRange(todoItems);
            await _context.SaveChangesAsync();

            return Ok(todoItems);
        }
    }
}