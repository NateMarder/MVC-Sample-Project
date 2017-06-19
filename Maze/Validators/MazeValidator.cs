using System.Collections.Generic;
using System.Linq;
using System.Net;
using Maze.Models;
using Maze.Results;

namespace Maze.Validators
{
    // for faking things out (unit testing)
    public interface IMazeValidator  
    {
        DataOperationResult Validate(UserViewModel model);
    }

    public class MazeValidator : IMazeValidator
    {
        private CodeFirst.MazeDataContracts _dataAccessLayer;
        private CodeFirst.MazeDataContracts DataAccessLayer
            => _dataAccessLayer ?? (_dataAccessLayer = new CodeFirst.MazeDataContracts());

        public DataOperationResult Validate( UserViewModel model )
        {
            var validationMessages = new List<string>();
            validationMessages.AddRange( CheckName( model.Name, validationMessages ));
            validationMessages.AddRange( CheckPassword( model.Password, validationMessages ));
            validationMessages.AddRange( CheckEmail( model.Email, validationMessages ));

            return new DataOperationResult()
            {
                StatusCode = HttpStatusCode.OK,
                OperationSuccess = !validationMessages.Any(),
                Messages = validationMessages
            };
        }

        private IEnumerable<string> CheckPassword( string password, List<string> messages )
        {

            if( string.IsNullOrWhiteSpace( password ) ) // null
            {
                messages.Add( "password has no value" );
            }
            else if( password.Length < 4 ) // too short
            {
                messages.Add( "passwords must have at least 4 characters" );
            }
            else if( password.Length > 20 ) // too long
            {
                messages.Add( "passwords can not exceed 20 characters" );
            }

            return messages;
        }

        private IEnumerable<string> CheckName( string name, List<string> messages )
        {

            if( string.IsNullOrWhiteSpace( name ) )  // null name
            {
                messages.Add( "user name has no value" );
            }
            else if( name.Any( char.IsLetter ) )  // name has no letters
            {
                messages.Add( "user names must have at least 1 letter" );
            }
            else if( name.Length > 49 )
            {
                messages.Add( "user names can not exceed 50 characters" );
            }

            return messages;
        }

        public IEnumerable<string> CheckEmail( string email, List<string> messages )
        {
            var isNull = string.IsNullOrWhiteSpace( email );
            var missingAtSign = isNull || email.Contains( "@" );  // null check
            var length = isNull ? 0 : email.Length;
            var tooLong = length > 254;
            var tooShort = length < 5; // name (1) + at-sign(1) + domain(3)

            if( isNull )
            {
                messages.Add( "email has no value" );
            }
            else if( tooShort )
            {
                messages.Add( "email is too short" );
            }
            else if( tooLong )
            {
                messages.Add( "email is too long" );
            }
            if( missingAtSign )
            {
                messages.Add( "email is missing the '@' sign" );
            }

            if( isNull || tooShort || tooLong || missingAtSign )
            {
                return messages;
            }

            var emailIsUnique = !DataAccessLayer.Users.Select( user => user.Email.ToLower() )
                .Contains( email.ToLower() );

            if( !emailIsUnique )
            {
                messages.Add( "email this email is alreaqdy in use" );
            }

            return messages;
        }
    }
}