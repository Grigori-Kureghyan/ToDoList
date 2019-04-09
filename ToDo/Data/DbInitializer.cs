using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDo.Models;

namespace ToDo.Data
{
    // To seed database with data if it is created for the first time.
    public class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            ApplicationDbContext context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            context.Database.EnsureCreated();

            AddToDoItemsAsync(context).GetAwaiter().GetResult();
        }

        public static async Task AddToDoItemsAsync(ApplicationDbContext context)
        {
            if (context.ToDoItems.Any())
            {
                return;
            }

            ToDoItem[] toDoItem = new ToDoItem[]
            {
                new ToDoItem{ Label="Breakfast", Important = false, Done = false },
                new ToDoItem{ Label="Yoga", Important = true, Done = false },
                new ToDoItem{ Label="Coffee break", Important = false, Done = false },
            };
            await context.ToDoItems.AddRangeAsync(toDoItem);
            await context.SaveChangesAsync();
        }
    }
}
