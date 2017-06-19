using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Maze.Controllers;


//TODO Implement implement unit tests here
namespace Maze.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        [TestMethod]
        public void Index()
        {
            // Arrange
            HomeController controller = new HomeController();

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull( result );
        }
    }
}
