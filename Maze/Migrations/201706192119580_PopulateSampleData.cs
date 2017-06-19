using System.IO;

namespace Maze.CodeFirst.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PopulateSampleData : DbMigration
    {
        public override void Up()
        {
            var sqlFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory,
                "../CodeFirst/CustomSqlScripts/addSampleData.sql");
           
            Sql(File.ReadAllText(sqlFilePath));
        }
        
        public override void Down()
        {
        }
    }
}
