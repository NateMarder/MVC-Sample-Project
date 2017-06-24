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
        public HttpStatusCode StatusCode { get; set; }

        public OperationSuccessResult()
        {
            Messages = new List<string>();
        }
    }

    public class DataOperationResult : OperationSuccessResult
    {
    }

    public class ValidationResult
    {
        public List<string> Messages { get; set; }
        public bool Valid { get; set; }
    }

    public class LoginSuccessResult : JsonResult
    {
        public string Message { get; set; }
        public RedirectResult Redirect { get; set; }
        public HttpStatusCode Status { get; set; }
        public int? UserId { get; set; }
    }
}