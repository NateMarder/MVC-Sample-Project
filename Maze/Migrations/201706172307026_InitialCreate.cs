using System.Data.Entity.Migrations;

namespace Maze.Migrations
{
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Maze",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Hash = c.String()
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Race",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        MazeId = c.Int(nullable: false),
                        UserId = c.Int(nullable: false),
                        CompletionTime = c.Single(nullable: false),
                        Date = c.DateTime(nullable: false)
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Email = c.String(),
                        JoinDate = c.DateTime(nullable: true),
                        Password = c.String()
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.User");
            DropTable("dbo.Race");
            DropTable("dbo.Maze");
        }
    }
}
