using System.Web.Mvc;

namespace Maze.Controllers
{
    public class ErrorController : MazeBaseController
    {
        // GET: Error
        public ViewResult Index()
        {
            return View("Error");
        }

        public ViewResult NotFound()
        {
            Response.StatusCode = 404; 
            return View("Error");
        }
    }
}