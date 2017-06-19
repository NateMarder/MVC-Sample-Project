using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;

namespace Maze.CodeFirst
{
    public interface IMazeCodeFirstContracts : IDisposable
    {
        IDbSet<Race> Races { get; set; }
        IDbSet<User> Users { get; set; }
        IDbSet<Maze> Mazes { get; set; }
    }

    public class MazeDataContracts : DbContext, IMazeCodeFirstContracts
    {
        public virtual IDbSet<Race> Races { get; set; }
        public virtual IDbSet<User> Users { get; set; }
        public virtual IDbSet<Maze> Mazes { get; set; }
    }

    [Table( "User", Schema = "dbo" )]
    public class User
    {
        [Key]
        [Column( "Id" )]
        public virtual int Id { get; set; }

        [Column( "Name" )]
        public string Name { get; set; }

        [Column( "Email" )]
        public string Email { get; set; }

        [Column( "JoinDate" )]
        public DateTime? JoinDate { get; set; }

        [Column( "Password" )]
        public string Password { get; set; }
    }

    [Table( "Maze", Schema = "dbo" )]
    public class Maze
    {
        [Key]
        [Column( "Id" )]
        public virtual int Id { get; set; }

        [Column( "Hash" )]
        public string Hash { get; set; }
    }

    [Table( "Race", Schema = "dbo" )]
    public class Race
    {
        [Key]
        [Column( "Id" )]
        public virtual int Id { get; set; }

        [Column( "MazeId" )]
        public virtual int MazeId { get; set; }

        [Column( "UserId" )]
        public virtual int UserId { get; set; }

        [Column( "CompletionTime" )]
        public virtual float CompletionTime { get; set; }

        [Column( "RaceDate" )]
        public virtual DateTime RaceDate { get; set; }
    }
}