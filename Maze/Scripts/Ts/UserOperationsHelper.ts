
class UserOperationsHelper {

    private readonly signInUrl: string;
    private readonly signUpUrl: string;

    constructor( model: any ) {
        this.signInUrl = model.signInUrl;
        this.signUpUrl = model.signUpUrl;
        this.setupBindings( model );
    }

    signUpNewUser( userModel ): void {

        const request = $.ajax( {
            global: true,
            async: true,
            dataType: "JSON",
            type: "POST",
            url: this.signUpUrl,
            data: userModel
        } );

        request.done((result) => {

            if (result.status === 200) {
                console.log("\ndone method \n  result data --> " + result.Data);
            }
            else {
                console.log("\ndone method \n  result data --> " + result.Data);
            }
        } );

        request.fail((result) => {
            console.log( "Failed to create user: " + result.status );
            console.log( "\n Reponse text: " + result.responseJSON.Data );
        } );

    }

    signInExistingUser( data ): void {

        const promise = $.ajax( {
            type: "POST",
            url: this.signInUrl,
            data: data
        } );
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