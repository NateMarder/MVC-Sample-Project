using System.Net;
using System.Web.Mvc;
using System.Collections.Generic;

namespace Maze.Results
{
    public class OperationSuccessResult : JsonResult
    {
        public List<string> Messages { get; set; }
        public bool OperationSuccess { get; set; }
    }

    public class DataOperationResult : OperationSuccessResult
    {
        public HttpStatusCode StatusCode { get; set; }
    }
}