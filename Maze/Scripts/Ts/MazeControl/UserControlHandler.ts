
namespace MazeApp {

    export class UserControlHandler {

        private readonly maze: MazeGraph;
        private controlNode: ControlNode;
        private aiNode: ArtificialIntelligenceNode;
        private triggerCoolDown: boolean = false;
        private aiNodeJqRef: any;
        private raceWithNode: boolean = true;
        private keepSpinning: boolean = true;
        private infiniteMode: boolean = false;

        public constructor( maze: MazeGraph ) {

            this.maze = maze;
            this.setupControlZoneElements();
            this.addUserControlNode();
            this.addAiControlNode();
            this.setupControlZoneBindings();
        }

        private setupControlZoneElements(): void {

            $( "#racemode > i, #new-maze > i, #level-display " ).css( {
                "font-size": this.maze.spacing + "px",
            } );

            $( "#level-display" ).text( `Level ${this.maze.currentLevel}` );
        }

        private setupControlZoneBindings(): void {

            $( "#new-maze" ).click(( e ) => {
                const currentUrl = window.location.href;
                document.location.href = currentUrl.split( "?" )[0];
            } );

            $( ".message-div" ).on( {
                click: () => { this.nextLevel(); },
                tap: () => { this.nextLevel(); }
            } );

            if ( this.raceWithNode ) {
                this.raceWithAiNodeBindings();
            } 
        }

        private nextLevel(): void {

            const url = window.location.href;
            document.location.href = url.split( "?" )[0] + "?l=" + this.maze.currentLevel;
        }

        private addUserControlNode(): void {

            const radius = Math.round( this.maze.spacing * .15 );
            const cx = +( this.maze.startKey.split( "." )[0] );
            const cy = +( this.maze.startKey.split( "." )[1] );

            this.controlNode = new ControlNode( {
                cx: cx,
                cy: cy,
                r: radius,
                offset: this.maze.spacing,
                options: null,
                ai: false,
                maze: this.maze
            } );

            this.maze.controlNode = this.controlNode;
        }

        private addAiControlNode(): void {

            const radius = Math.round( this.maze.spacing * .15 );
            const cx = +( this.maze.startKey.split( "." )[0] );
            const cy = +( this.maze.startKey.split( "." )[1] );

            this.aiNode = new ArtificialIntelligenceNode( {
                cx: cx,
                cy: cy,
                r: radius,
                offset: this.maze.spacing,
                options: null,
                ai: true,
                maze: this.maze
            } );


            if ( this.maze.solutionNodes == null ) {
                this.maze.solutionNodes = this.maze.mazeSolver.run();
            }

            this.aiNode.setSolutionNodeKeys( this.maze.solutionNodes );
            this.maze.aiNode = this.aiNode;
            this.aiNode.svgJq.velocity( { opacity: 0 }, { duration: 0 } );
        }

        private raceWithAiNodeBindings(): any {

            $( "#racemode" ).click(( e ) => {
                if ( +this.aiNode.svgJq.css( "opacity" ) === 0 ) {
                    $( "#level-display" ).addClass( "blue" );
                    $( ".fa-retweet, .racemode-label" ).addClass( "magenta" ).removeClass( "grey" );
                    this.controlNode.coolDown = false;
                    this.aiNode.keepRacing = true;
                    setTimingMarks(this.maze);
                    this.aiNode.kickOffRace();

                } else {
                    this.aiNode.keepRacing = false;
                    $( ".fa-retweet, .racemode-label" ).addClass( "grey" ).removeClass( "magenta" );
                    $( "#level-display" ).removeClass( "blue" );
                    this.aiNode.goHome( false );
                }
            } );
        }
    }
}