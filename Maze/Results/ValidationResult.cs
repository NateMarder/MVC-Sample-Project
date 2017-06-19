using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;
using Microsoft.ApplicationInsights.Web;

namespace Maze.Results
{
    public class OperationSuccessResult : JsonResult
    {
        public List<string> Messages { get; set; }
        public bool ValidModel { get; set; }
    }

    public class DataOperationResult : OperationSuccessResult
    {
        public HttpStatusCode StatusCode { get; set; }
    }

    public class LoginSuccessResult : JsonResult
    {
        public string Message { get; set; }
        public RedirectResult Redirect { get; set; }
        public HttpStatusCode Status { get; set; }
        public int? UserId { get; set; }
    }
}