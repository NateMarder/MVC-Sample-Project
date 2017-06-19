using System;
using System.Web.Mvc;
using Maze.CodeFirst;
using Maze.Validators;

namespace Maze.Controllers
{
    public class UserOperationsController : Controller
    {

        private IMazeValidator _mazeValidator;
        private IMazeValidator MazeValidator
            => _mazeValidator ?? (_mazeValidator = new MazeValidator());

        private MazeDataContracts _dataAccessLayer;
        private MazeDataContracts DataAccessLayer
            => _dataAccessLayer ?? (_dataAccessLayer = new MazeDataContracts());

        public UserOperationsController()
        {
        }

        public UserOperationsController(
            IMazeValidator mazeValidator = null,
            MazeDataContracts dataAccessLayer = null )
        {
            _mazeValidator = mazeValidator;
            _dataAccessLayer = dataAccessLayer;
        }
        
        //TODO Implement login here - session should begin here
        public JsonResult UserLogin()
        {
            throw new NotImplementedException();
        }

        //TODO Implement logout here - session should abandon here
        public JsonResult UserLogout()
        {
            throw new NotImplementedException();
        }


        public JsonResult CreateNewUser()
        {
            throw new NotImplementedException();
        }
    }
}