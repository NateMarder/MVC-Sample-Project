using System;

namespace Maze.Models
{
    public class RaceResultViewModel
    {
        public int MazeId { get; set; }
        public string MazeHash { get; set; }
        public int UserId { get; set; }
        public DateTime? RaceDate { get; set; }
        public double CompletionTime { get; set; }
    }
}