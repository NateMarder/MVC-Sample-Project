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

        //TODO Move This Logic to UserOperationsController
        public JsonResult UserLogout( UserViewModel model )
        {
            Session.Abandon();
            //TODO Return user log out confirmation page
            return new JsonResult();
        }

        //TODO : Move This Logic to UserOperationsController
        public JsonResult UserLogin( UserViewModel model )
        {
            var id = DataAccessLayer.Users
                .Where( u => u.Email == model.Email )
                .Select( u => u.Id )
                .FirstOrDefault();
            if( true )
            {
                Session[SessionKeys.UserId] = id;
            }
            return new JsonResult();
        }

        //TODO Move This Logic to UserOperationsController
        [AllowAnonymous]
        [HttpPost]
        public DataOperationResult AddNewUser( UserViewModel model )
        {
            var result = new DataOperationResult();
            var validationResult = MazeValidator.Validate( model );
            if( !validationResult.OperationSuccess )
            {
                return new DataOperationResult
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    OperationSuccess = false,
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
                result.OperationSuccess = true;
                result.Messages.Add( "The First Rule of Maze Club is Don't Talk About Maze Club" );
            }
            catch( Exception )
            {
                result.OperationSuccess = false;
                result.Messages.Add( "Unable to add new user right now" );
            }


            return result;
        }
    }



    public class SessionKeys
    {
        public const string UserId = "UserId";
    }
}