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

        [AllowAnonymous]
        [HttpPost]
        public JsonResult UserLogin( UserLoginViewModel model )
        {
            var validator = new UserLoginValidator();
            var validationResult = validator.Validate( model );
            var result = new LoginSuccessResult();

            if( validationResult.Valid )
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
        public JsonResult UserLogout( UserViewModel model )
        {
            Session.Abandon();

            //TODO Return user log out confirmation page
            return new JsonResult();
        }

        [AllowAnonymous]
        [HttpPost]
        public OperationSuccessResult CreateNewUser( UserViewModel model )
        {
            var result = new OperationSuccessResult();
            var validationResult = MazeValidator.Validate( model );
            if( !validationResult.Valid )
            {
                return new OperationSuccessResult
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    ValidModel = false,
                    Messages = validationResult.Messages
                };
            }
            try
            {
                var newUser = new User
                {
                    Name = model.Name,
                    Email = model.Email,
                    Password = model.Password
                };

                DataAccessLayer.Users.Add( newUser );
                DataAccessLayer.SaveChanges();
                result.Messages.Add( "Welcome to Maze Club, "+model.Name+". " +
                                     "\nThe First Rule of Maze Club is Don't " +
                                     "Talk About Maze Club" );
            }
            catch( Exception )
            {
                result.Messages.Add( "Unable to add new user right now" );
            }

            result.Data = Json( result.Messages );
            return result;
        }
    }

    public class SessionKeys
    {
        public const string UserId = "UserId";
    }
}