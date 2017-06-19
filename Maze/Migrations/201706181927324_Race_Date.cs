using System.Data.Entity.Migrations;

namespace Maze.Migrations
{
    public partial class Race_Date : DbMigration
    {
        public override void Up()
        {
            AddColumn( "dbo.Race", "Date", c => c.DateTime( nullable: false ) );
        }

        public override void Down()
        {
            DropColumn( "dbo.Race", "Date" );
        }
    }
}
