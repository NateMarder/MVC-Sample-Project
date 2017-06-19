namespace Maze.Models
{
    public class DashboardViewModel : MazeBaseViewModel
    {
        public UserViewModel UserModel { get; set; }
        public RaceViewModel[] Races { get; set; }
    }
}