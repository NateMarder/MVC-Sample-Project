
namespace MazeApp {

    export class ControlNode {

        home: number[] = [];
        cx: number;
        cy: number;
        r: number;
        svg: SVGElement;
        offSet: number;
        mazeGraph: MazeGraph;
        speed: number = 40;
        coolDown = false;
        svgJq: JQuery;
        mazeHeight: number = 0;
        mazeWidth: number = 0;

        public constructor( initParams: IUserControlInitParams ) {

            this.cx = initParams.cx;
            this.cy = initParams.cy;
            this.r = initParams.r;
            this.mazeGraph = initParams.maze;
            this.home[0] = this.cx;
            this.home[1] = this.cy;
            this.offSet = initParams.offset;
            this.mazeHeight = +this.mazeGraph.svg.attributes["height"].value;
            this.mazeWidth = +this.mazeGraph.svg.attributes["width"].value;

            if ( !initParams.ai ) {

                this.svg = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );
                this.svg.setAttribute( "cx", this.cx.toString() );
                this.svg.setAttribute( "cy", this.cy.toString() );
                this.svg.setAttribute( "r", this.r.toString() );
                this.svg.setAttribute( "class", "mz-node control-node" );
                this.svg.setAttribute( "id", "controlnode" );
                this.mazeGraph.svg.appendChild( this.svg );
                this.svgJq = $( "circle.control-node" );
                this.handleBindings();
            }
        }

        private move( direction: MazeApp.Direction ): boolean {

            const newPos = this.getNewCoordinates( direction );

            if ( !this.checkMove( newPos.x, newPos.y, direction ) ) return false;

            const alias = this;
            this.svgJq.velocity(
                {
                    cx: newPos.x,
                    cy: newPos.y
                },
                {
                    duration: this.speed,
                    easing: "linear",
                    complete: () => {
                        this.coolDown = false;
                        this.cx = newPos.x;
                        this.cy = newPos.y;
                        this.svg.setAttribute( "cx", String( newPos.x ) );
                        this.svg.setAttribute( "cy", String( newPos.y ) );
                        const key = newPos.x + "." + newPos.y;

                        if ( key === this.mazeGraph.endKey && $( "span.racemode-label" ).hasClass( "magenta" ) ) {
                            this.mazeGraph.aiNode.keepRacing = false;
                            showEnding( this.mazeGraph.aiNode, this.mazeGraph );
                            return true;
                        }

                        if ( this.mazeGraph.nodes[key].siblings.length < 3 ) {
                            const goingToDirection = this.nextDirection( direction, key );
                            return this.move( goingToDirection );
                        }

                        return true;
                    }
                } );

            return false;
        }

        private getNewCoordinates( direction: Direction ): IPoint {

            const point: IPoint = {
                x: this.cx,
                y: this.cy
            };

            switch ( direction ) {
                case Direction.Left:
                    point.x = this.cx - this.offSet;
                    break;
                case Direction.Right:
                    point.x = this.cx + this.offSet;
                    break;
                case Direction.Up:
                    point.y = this.cy - this.offSet;
                    break;
                case Direction.Down:
                    point.y = this.cy + this.offSet;
                    break;
                default: break;
            }

            return point;
        }

        private checkMove( newXPos: number, newYPos: number, direction: Direction ): boolean {

            if ( this.coolDown ) {
                return false;
            }

            const currNode = this.mazeGraph.nodes[this.cx + "." + this.cy];
            const siblingAhead = currNode.siblings.indexOf( String( newXPos ) + "." + String( newYPos ) ) > -1;
            if ( !siblingAhead ) return false;

            switch ( direction ) {
                case Direction.Left:
                    if ( this.cx <= this.offSet ) return false;
                    break;

                case Direction.Right:
                    if ( this.cx + this.offSet > $( this.mazeGraph.svg ).width() ) return false;
                    break;

                case Direction.Up:
                    if ( this.cy <= this.offSet ) return false;
                    break;

                case Direction.Down:
                    if ( this.cy + this.offSet > $( this.mazeGraph.svg ).height() ) return false;
                    break;
            }

            return this.coolDown = true;
        }

        private handleBindings(): MazeGraph {

            $( document.body ).keydown(( e ) => {
                switch ( e.which ) {
                    case 38:
                        this.move( Direction.Up );
                        break;
                    case 40:
                        this.move( Direction.Down );
                        break;
                    case 37:
                        this.move( Direction.Left );
                        break;
                    case 39:
                        this.move( Direction.Right );
                        break;
                    case 87:
                        this.move( Direction.Up );
                        break;
                    case 83:
                        this.move( Direction.Down );
                        break;
                    case 65:
                        this.move( Direction.Left );
                        break;
                    case 68:
                        this.move( Direction.Right );
                        break;
                    case 78:
                        $( "#new-maze" ).trigger( "click" );
                        break;
                    case 82:
                        $( "#racemode" ).trigger( "click" );
                        break;
                    default:
                        break;
                }
            } );

            // swipe controls
            $( ".mz-container" ).on( {
                swipeleft: () => { this.move( Direction.Left ); },
                swiperight: () => { this.move( Direction.Right ); },
                swipeup: () => { this.move( Direction.Up ); },
                swipedown: () => { this.move( Direction.Down ); },
                ontouchstart: ( e ) => { e.preventDefault(); },
                ontouchmove: ( e ) => { e.preventDefault(); }
            } );

            return this.mazeGraph;
        }

        nextDirection( oldDirection: Direction, key: string ): Direction {

            const oldX = this.cx;
            const oldY = this.cy;

            for ( let siblingId of this.mazeGraph.nodes[key].siblings ) {

                const split = siblingId.split( "." );
                const newX = +split[0];
                const newY = +split[1];

                switch ( oldDirection ) {
                    case Direction.Up:
                        if ( newY <= oldY ) {
                            if ( newY < oldY ) return Direction.Up;
                            if ( newX < oldX ) return Direction.Left;
                            if ( newX > oldX ) return Direction.Right;
                        }
                        break;

                    case Direction.Right:
                        if ( newX >= oldX ) {
                            if ( newY < oldY ) return Direction.Up;
                            if ( newY > oldY ) return Direction.Down;
                            if ( newX > oldX ) return Direction.Right;
                        }
                        break;

                    case Direction.Down:
                        if ( newY >= oldY ) {
                            if ( newY > oldY ) return Direction.Down;
                            if ( newX < oldX ) return Direction.Left;
                            if ( newX > oldX ) return Direction.Right;
                        }
                        break;

                    case Direction.Left:
                        if ( newX <= oldX ) {
                            if ( newX < oldX ) return Direction.Left;
                            if ( newY < oldY ) return Direction.Up;
                            if ( newY > oldY ) return Direction.Down;
                        }
                        break;

                    default:
                        break;
                }
            }
        }
    }

    export class ArtificialIntelligenceNode extends ControlNode {

        solutionNodeKeys: string[];
        keepRacing: boolean = true;

        public constructor( initParams: IUserControlInitParams ) {
            super( initParams );
            this.speed = aINodeSpeed[this.mazeGraph.currentLevel.toString()];
            this.setUpSvg();
        }

        setSolutionNodeKeys( keys: string[] ): void {
            this.solutionNodeKeys = keys;
        }

        animateTowardsDestinationNode( positionNodes: string[] ): boolean {

            if ( !this.keepRacing ) {
                return true;
            }

            const nodeKey = positionNodes.shift().split( "." );
            const xPos = +nodeKey[0];
            const yPos = +nodeKey[1];

            this.svgJq
                .velocity(
                {
                    cx: xPos,
                    cy: yPos
                },
                {
                    queue: false,
                    duration: this.speed,
                    easing: "linear",
                    complete: () => {
                        this.coolDown = false;
                        this.cx = xPos;
                        this.cy = yPos;
                        this.svg.setAttribute( "cx", String( this.cx ) );
                        this.svg.setAttribute( "cy", String( this.cy ) );
                        if ( positionNodes[0] === this.mazeGraph.endKey ) {
                            MazeApp.sendControlNodeHome( this.mazeGraph, true );
                            this.goHome( true );
                            return true;
                        } else if ( this.keepRacing ) {
                            return this.animateTowardsDestinationNode( positionNodes );
                        } else {
                            return true;
                        }
                    }
                } );
            return true;
        }

        kickOffRace(): void {
            let nodeArray = [];
            nodeArray = this.mazeGraph.solutionNodes.slice();
            if ( this.keepRacing ) {
                MazeApp.sendControlNodeHome( this.mazeGraph, true );
                setTimeout(() => {
                    this.svgJq
                        .velocity(
                        {
                            opacity: 1
                        },
                        {
                            duration: goHomeSpeed(),
                            complete: () => {
                                this.animateTowardsDestinationNode( nodeArray );
                            }
                        } );
                },
                    goHomeSpeed() );
            }
        }



        private setUpSvg(): void {
            this.svg = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );
            this.svg.setAttribute( "cx", this.cx.toString() );
            this.svg.setAttribute( "cy", this.cy.toString() );
            this.svg.setAttribute( "r", this.r.toString() );
            this.svg.setAttribute( "class", "mz-node ai-node" );
            this.svg.setAttribute( "id", "ainode" );
            this.mazeGraph.svg.appendChild( this.svg );
            this.svgJq = $( "circle.ai-node" );
        }

        fadeOutSafely(): void {
            this.svgJq.velocity( { opacity: 0 }, { duration: 0 } );
        }

        goHome( beginNewRace: boolean ): boolean {

            this.svgJq
                .velocity( "stop", false )
                .velocity(
                {
                    cx: this.home[0],
                    cy: this.home[1]
                },
                {
                    duration: goHomeSpeed(),
                    easing: "linear",
                    complete: () => {
                        [this.cx, this.cy] = this.home;
                        this.svg.setAttribute( "cx", String( this.home[0] ) );
                        this.svg.setAttribute( "cy", String( this.home[1] ) );
                        if ( beginNewRace && this.keepRacing ) {
                            MazeApp.sendControlNodeHome( this.mazeGraph, true );
                            this.kickOffRace();
                            return true;
                        } else {
                            this.svgJq.velocity( { opacity: 0 }, { duration: goHomeSpeed() } );
                            return true;
                        }
                    }
                } );

            return true;
        }
    }
}