using System;

namespace Maze.Models
{
    public class RaceViewModel : MazeBaseViewModel
    {
        public int? RaceId { get; set; }
        public int MazeId { get; set; }
        public string MazeHash { get; set; }
        public int UserId { get; set; }
        public double CompletionTime { get; set; }
        public DateTime RaceDate { get; set; }
    }
}