/// <reference path="../../typings/globals/jquery/index.d.ts" />

namespace MazeApp {

    export interface IDashboardInitParams {
        data: any;
        tableBody: JQuery;
    }

    export class Dashboard {

        tableBody: JQuery;

        public constructor( model: IDashboardInitParams ) {
            this.tableBody = model.tableBody;
            this.buildTheTable( model.data );
        }

        private buildTheTable( data: any ) {

            for ( let i = 0; i < data.length; i++ ) {

                const row = document.createElement( "tr" );
                const td1 = document.createElement( "td" );
                const td2 = document.createElement( "td" );
                const td3 = document.createElement( "td" );
                const mazeLink = document.createElement( "a" );

                td1.innerText = this.parseDate( data[i].RaceDate );
                td2.innerText = data[i].CompletionTime;
                $( mazeLink )
                    .attr( "href", this.buildMazeLink( data[i].MazeId ) )
                    .text( "Maze " + data[i].MazeId );
                $( td3 ).append( $( mazeLink ) );

                row.appendChild( td1 );
                row.appendChild( td2 );
                row.appendChild( td3 );

                this.tableBody.append( $( row ) );
            }
        }

        private buildMazeLink( mazeId:string ):string {
            return window.location.href
                .replace("Dashboard", "Race/")
                .concat("?id=" + mazeId);
        }

        private parseDate( unParsedDate: string ): any {
            const cleanString = unParsedDate
                .replace( "Date(", "" ).replace( /\/+/, "" ).replace( /\)\/+/, "" );
            const dateAsNumber = parseInt( cleanString );
            const prettyDate = new Date( dateAsNumber );
            return prettyDate.toLocaleDateString();
        }
    }
}