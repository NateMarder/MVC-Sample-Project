using System;
using System.Linq;
using System.Web.Mvc;
using Maze.CodeFirst;
using Maze.Models;
using Maze.Results;
using Maze.Validators;

namespace Maze.Controllers
{
    public class RaceController : MazeBaseController
    {

        public RaceController()
        {
        }

        public RaceController(
            IMazeValidator mazeValidator = null,
            MazeDataContracts dataAccessLayer = null )
            : base( mazeValidator, dataAccessLayer )
        {
        }
        
        //TODO Make Antiforgery Token Verification Happen
        public ActionResult Index( int? id ) //id refers to raceId
        {
            var userId = 1; //default guest id this is very temporary
            var safeIdCheck = Session[SessionKeys.UserId];
            if (safeIdCheck != null)
            {
                userId = int.Parse(Session[SessionKeys.UserId].ToString());
            }

            var model = GetRaceViewModel( id, userId );
            return View( model );
        }

        public RaceViewModel GetRaceViewModel( int? mazeId, int userId )
        {
            var model = new RaceViewModel();
            if( mazeId != null ) // retrieve data from DB
            {
                var maze = DataAccessLayer.Mazes.FirstOrDefault( mz => mz.Id == mazeId.Value );

                if (maze == null) return model;

                model.MazeHash = maze.Hash;
                model.MazeId = maze.Id;
                model.UserId = userId;
                model.RaceDate = new DateTime();
            }
            else // tell view to build new maze client-side
            {
                model.UserId = userId;
                model.RaceDate = new DateTime();
            }

            return model;
        }

        // TO-DO Enable Maze Saving!
        public OperationSuccessResult SaveRaceResult( RaceResultViewModel model )
        {
            throw new NotImplementedException();
        }
    }
}