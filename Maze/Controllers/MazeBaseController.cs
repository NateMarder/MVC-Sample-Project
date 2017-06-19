using System.Web.Mvc;
using Maze.CodeFirst;
using Maze.Validators;

namespace Maze.Controllers
{
    public class MazeBaseController : Controller
    {

        private IMazeValidator _mazeValidator;
        public IMazeValidator MazeValidator
            => _mazeValidator ?? (_mazeValidator = new MazeValidator());

        private MazeDataContracts _dataAccessLayer;
        public MazeDataContracts DataAccessLayer
            => _dataAccessLayer ?? (_dataAccessLayer = new MazeDataContracts());

        public MazeBaseController()
        {
        }

        public MazeBaseController( 
            IMazeValidator mazeValidator = null, 
            MazeDataContracts dataAccessLayer = null)
        {
            _mazeValidator = mazeValidator;
            _dataAccessLayer = dataAccessLayer;
        }
    }
}