using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Maze.Models
{
    public class UserLoginViewModel : MazeBaseViewModel
    {
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
    }
}