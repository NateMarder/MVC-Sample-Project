using System.Data.Entity.Migrations;

namespace Maze.Migrations
{
    public partial class Alter_RaceDate2 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Race", name: "Date", newName: "RaceDate");
        }
        
        public override void Down()
        {
            RenameColumn(table: "dbo.Race", name: "RaceDate", newName: "Date");
        }
    }
}
