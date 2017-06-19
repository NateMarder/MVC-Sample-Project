using System.Data.Entity.Migrations;
using Maze.CodeFirst;

namespace Maze.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<MazeDataContracts>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "Maze.CodeFirst.MazeDataContracts";
        }

        protected override void Seed(MazeDataContracts context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
        }
    }
}