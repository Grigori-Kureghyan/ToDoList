using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDo.Models
{
    public class ToDoItem
    {
        public int ID { get; set; }

        public string Label { get; set; }

        public bool Important { get; set; } = false;

        public bool Done { get; set; } = false;
    }
}
