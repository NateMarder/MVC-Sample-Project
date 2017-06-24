using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;
using Microsoft.ApplicationInsights.Web;

namespace Maze.Results
{
    public class OperationSuccessResult : JsonResult
    {
        public OperationSuccessResult()
        {
            Messages = new List<string>();
        }

        public OperationSuccessResult(HttpStatusCode statusCode)
        {
            StatusCode = statusCode;
            Messages = new List<string>();
        }

        public List<string> Messages { get; set; }
        public HttpStatusCode StatusCode { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            context.RequestContext.HttpContext.Response.StatusCode = (int) StatusCode;
            base.ExecuteResult(context);
        }
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