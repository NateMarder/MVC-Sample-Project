using System;
using System.Linq;
using System.Web.Mvc;
using Maze.CodeFirst;
using Maze.Validators;

namespace Maze.Controllers
{
    public class HomeController : MazeBaseController
    {

        public HomeController()
        {
        }

        public HomeController( 
            IMazeValidator mazeValidator = null, 
            MazeDataContracts dataAccessLayer = null)
            :base(mazeValidator,dataAccessLayer)
        {
        }

        public ActionResult Index()
        {
            return View();
        }

    }
}