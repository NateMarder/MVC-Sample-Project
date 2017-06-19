using System;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Maze.CodeFirst;
using Maze.Models;
using Maze.Results;
using Maze.Validators;

namespace Maze.Controllers
{
    public class UserOperationsController : Controller
    {

        private IMazeValidator _mazeValidator;
        private IMazeValidator MazeValidator
            => _mazeValidator ?? (_mazeValidator = new NewUserRequestValidator());

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

        [HttpPost]
        [AllowAnonymous]
        public JsonResult UserLogin( UserLoginViewModel model )
        {
            var validator = new UserLoginValidator();
            var validationResult = validator.Validate( model );
            var result = new LoginSuccessResult();

            if( validationResult.ValidModel )
            {
                var user = DataAccessLayer.Users.FirstOrDefault( u => u.Email.Equals( model.UserEmail ) );
                if( user != null )
                {
                    Session[SessionKeys.UserId] = user.Id;
                    result.Status = HttpStatusCode.Accepted;
                    result.Message = "Login successful.";
                    result.UserId = user.Id;

                    return result;
                }
            }

            result.Status = HttpStatusCode.NotAcceptable;
            result.Message = validationResult.Messages.ToString();

            return result;
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