using System.Linq;
using System.Web.Mvc;
using Maze.CodeFirst;
using Maze.Models;
using Maze.Validators;


namespace Maze.Controllers
{
    public class DashboardController : MazeBaseController
    {

        public DashboardController()
        {
        }

        public DashboardController( 
            IMazeValidator mazeValidator = null, 
            MazeDataContracts dataAccessLayer = null)
            :base(mazeValidator,dataAccessLayer)
        {
        }

        //TODO : Make AntiforgeryTokenValidation Work
        public ActionResult Index( int? id )
        {
            id = id ?? 1;
            var model = RetrieveModel( id );
            return View( model );
        }

        private DashboardViewModel RetrieveModel( int? id )
        {
            var userModel = DataAccessLayer.Users
                .Where( u => u.Id == id )
                .Select( u => new UserViewModel
                {
                    Name = u.Name,
                    Email = u.Email,
                    Password = u.Password
                } ).FirstOrDefault();

            var raceModels = DataAccessLayer.Races
                .Where(race => race.UserId == id)
                .OrderBy(race => race.RaceDate)
                .Select(race => new RaceViewModel
                {
                    RaceId = race.Id,
                    MazeId = race.MazeId,
                    RaceDate = race.RaceDate,
                    CompletionTime = race.CompletionTime,
                    MazeHash = DataAccessLayer.Mazes.FirstOrDefault(mz => mz.Id == race.MazeId).Hash
                }).ToArray();
  
            return new DashboardViewModel
            {
                UserModel = userModel,
                Races = raceModels
            };
        }
    }
}