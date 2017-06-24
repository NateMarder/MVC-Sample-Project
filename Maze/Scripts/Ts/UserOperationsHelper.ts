
class UserOperationsHelper {

    private readonly signInUrl: string;
    private readonly signUpUrl: string;

    constructor( model: any ) {
        this.signInUrl = model.signInUrl;
        this.signUpUrl = model.signUpUrl;
        this.setupBindings( model );
    }

    signUpNewUser( userModel ): void {
        var _this = this;
        const callback:JQueryXHR = $.ajax( {
            type: "POST",
            url: _this.signUpUrl,
            data: userModel,
            success: ( response ) => {
                _this.printResult(response, "[USER CREATION]");
                alert( "success" );
            }
        } );

        callback.always((response) => {
            _this.printResult(response, "[USER CREATION]");
        });
    }

    signInExistingUser( data ): void {

        const promise = $.ajax( {
            type: "POST",
            url: this.signInUrl,
            data: data
        } );

        promise.done(( response ) => {
            this.printResult( response, "[Sign In Existing User]" );
        } );
    }

    printResult( response: any, operationType: string ): void {

        console.log( "\nResponse Content From Operation: " + operationType );
        console.log( "\n   Status --> " + response.status );
        console.log( "\n  Message --> " + response.message );
        console.log( "\n     Data -->  " + response.data );

    }

    setupBindings( urls: any ): void {

        $( "#signin" ).submit(( e ) => {
            e.preventDefault();

            const loginData = {
                Email: $( "#user-email" ).val(),
                Password: $( "#user-password" ).val()
            };

            //TODO: add client-side validation to loginData
            this.signInExistingUser( loginData );
        } );

        $( "#signup" ).submit(( e ) => {
            e.preventDefault();

            var signUpData = {
                Name: $( "#new-user-name" ).val(),
                Email: $( "#new-user-email" ).val(),
                Password: $( "#new-user-password" ).val()
            };

            //TODO: add client-side validation to signUpData
            this.signUpNewUser( signUpData );
        } );
    }
}