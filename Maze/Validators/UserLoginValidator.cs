using System.Collections.Generic;
using System.Linq;
using System.Net;
using Maze.CodeFirst;
using Maze.Models;
using Maze.Results;

namespace Maze.Validators
{
    public class UserLoginValidator : IMazeValidator
    {
        private MazeDataContracts _dataAccessLayer;

        private MazeDataContracts DataAccessLayer
            => _dataAccessLayer ?? (_dataAccessLayer = new MazeDataContracts());

        public virtual DataOperationResult Validate(MazeBaseViewModel model)
        {
            var newUserModel = model as UserLoginViewModel;
            var validationMessages = new List<string>();
            if (newUserModel != null)
                validationMessages.AddRange(CheckPassword(
                    newUserModel.UserPassword,
                    newUserModel.UserEmail,
                    validationMessages));
            else
                validationMessages.Add("Invalid email / password combination provided");

            return new DataOperationResult
            {
                StatusCode = HttpStatusCode.OK,
                ValidModel = !validationMessages.Any(),
                Messages = validationMessages
            };
        }

        private IEnumerable<string> CheckPassword(string password, string email, List<string> messages)
        {
            var user = DataAccessLayer.Users.FirstOrDefault(u => u.Email == email);
            var passwordOkay = user != null && user.Password.Equals(password);
            if (!passwordOkay)
                messages.Add("Invalid password provided");
            return messages;
        }
    }
}