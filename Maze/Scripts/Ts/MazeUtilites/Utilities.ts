
namespace MazeApp {

    export function detectDeviceType(): DeviceType {
        let type: DeviceType;
        if ( "ontouchstart" in document && $( window ).width() < 1500 ) {
            type = DeviceType.Mobile;
        }
        else {
            type = DeviceType.Desktop;
        }
        return type;
    }

    export function shuffle( array: any[] ) {
        for ( let i = array.length - 1; i > 0; i-- ) {
            const j = Math.floor( Math.random() * ( i + 1 ) );
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    export function transformHexToDirection( input: string ): string[] {

        switch ( input ) {

            case "0": return ["0", "0", "0", "0"];
            case "1": return ["0", "0", "0", "1"];
            case "2": return ["0", "0", "1", "0"];
            case "3": return ["0", "0", "1", "1"];
            case "4": return ["0", "1", "0", "0"];
            case "5": return ["0", "1", "0", "1"];
            case "6": return ["0", "1", "1", "0"];
            case "7": return ["0", "1", "1", "1"];
            case "8": return ["1", "0", "0", "0"];
            case "9": return ["1", "0", "0", "1"];
            case "a": return ["1", "0", "1", "0"];
            case "b": return ["1", "0", "1", "1"];
            case "c": return ["1", "1", "0", "0"];
            case "d": return ["1", "1", "0", "1"];
            case "e": return ["1", "1", "1", "0"];
            case "f": return ["1", "1", "1", "1"];

            default: return ["-1", "-1", "-1", "-1"];
        }
    }

    export function getOrthogonalKey( x1: number, y1: number, x2: number, y2: number ): string {
        let wX1: number;
        let wY1: number;
        let wX2: number;
        let wY2: number;

        if ( x1 === x2 ) {
            const high = y2 > y1 ? y2 : y1;
            const low = y2 !== high ? y2 : y1;
            const dX = Math.round(( high - low ) / 2 );
            wY1 = wY2 = high - dX;
            wX1 = x1 - dX;
            wX2 = x1 + dX;
        }
        else {
            const high = x2 > x1 ? x2 : x1;
            const low = x2 !== high ? x2 : x1;
            const dX = Math.round(( high - low ) / 2 );
            wX1 = wX2 = high - dX;
            wY1 = y1 - dX;
            wY2 = y1 + dX;
        }

        return wX1 + "." + wY1 + "." + wX2 + "." + wY2;
    }

    export function getHexFromDecimalString( input: number ): string {

        switch ( input ) {
            case 10: return "a";
            case 11: return "b";
            case 12: return "c";
            case 13: return "d";
            case 14: return "e";
            case 15: return "f";
            default: return input.toString();
        }
    }

    export function getVelocityFromLevel( level: number ): number {

        switch ( level ) {
            case 0: return levelSpeed.One;
            case 1: return levelSpeed.One;
            case 2: return levelSpeed.Two;
            case 3: return levelSpeed.Three;
            case 4: return levelSpeed.Four;
            case 5: return levelSpeed.Five;
            case 6: return levelSpeed.Six;
            case 7: return levelSpeed.Seven;
            case 8: return levelSpeed.Eight;
            case 9: return levelSpeed.Nine;
            case 10: return levelSpeed.Ten;
            default: return -1;
        }
    }

    export function toggleColors( count: number, level: number ): void {

        if ( count === 0 ) {
            $( ".level-defeated-msg" ).text( `You defeated level: ${level - 1}` );
            $( "#mz-svg" ).hide();
            $( ".control-zone" ).hide();

            $( "#msg-container" ).css( {
                "height": "100%",
                "display": "block",
                "padding": "75px 25px"
            } );

            const url = window.location.href;
            $( "#msg-container" ).click(() => {
                document.location.href = url.split( "?" )[0] + "?l=" + level;
            } );

            window.setTimeout(() => {
                document.location.href = url.split( "?" )[0] + "?l=" + level;
            },
                3000 );

        } else {
            const newcount = count - 1;
            if ( newcount > 0 ) {
                window.setTimeout(() => {
                    $( ".green, .magenta" ).toggleClass( "green" ).toggleClass( "magenta" );
                    toggleColors( newcount, level );
                },
                    100 );
            } else {
                toggleColors( newcount, level );
            }
        }
    };

    export function handleMazeCompletion( count: number, level: number ): void {

        count = count == null ? 0 : count;
        toggleColors( count, level );
    };

    export function setTimingMarks(mazeGraph):void {
        mazeGraph.raceTime1 = performance.now();
    }

    export function getRaceCompletionTime(mazeGraph): number {
        if ( mazeGraph.raceTime === null ) {
            return -1;
        }
        mazeGraph.raceTime2 = performance.now();
        const duration = mazeGraph.raceTime2 - mazeGraph.raceTime1;
        const secs = duration / 1000;
        const rounded = Math.round( secs * 100 ) / 100; // round to hundredths
        return rounded;
    }

    export function showEnding( node: ArtificialIntelligenceNode, mazeGraph: MazeGraph ) {

        alert( "that took: " + getRaceCompletionTime(mazeGraph) );
        node.fadeOutSafely();
        incrementLevel( mazeGraph );
        sendControlNodeHome( mazeGraph, true );

        const walls = $( ".mz-wall.wall-active, .border-wall" );
        walls.each(( i ) => {
            if ( i % 2 === 0 ) {
                $( walls[i] ).addClass( "green" );
            } else {
                $( walls[i] ).addClass( "magenta" );
            }
        } );
        handleMazeCompletion( 15, mazeGraph.currentLevel );
    };

    export function goToYourHome( node: ControlNode ): any {

        node.svgJq.velocity(
            {
                cx: node.home[0],
                cy: node.home[1]
            },
            {
                duration: node.speed,
                easing: "spring",
                complete: () => {
                    node.coolDown = false;
                    node.cx = node.home[0];
                    node.cy = node.home[1];
                    node.coolDown = false;
                    node.svgJq
                        .attr( "cx", node.home[0] )
                        .attr( "cy", node.home[1] )
                        .removeAttr( "style" );

                    node.svgJq.velocity( "stop", true );
                }
            } );
    };

    export function sendControlNodeHome( maze: MazeGraph, stop?: boolean ): any {

        const jqNode = maze.controlNode.svgJq;
        const cntrlNode = maze.controlNode;

        $( "circle.control-node" ).velocity(
            {
                cx: cntrlNode.home[0],
                cy: cntrlNode.home[1]
            },
            {
                duration: goHomeSpeed(),
                easing: "linear",
                complete: () => {
                    cntrlNode.coolDown = false;
                    cntrlNode.cx = cntrlNode.home[0];
                    cntrlNode.cy = cntrlNode.home[1];
                    cntrlNode.coolDown = false;
                    jqNode
                        .attr( "cx", cntrlNode.home[0] )
                        .attr( "cy", cntrlNode.home[1] )
                        .removeAttr( "style" );

                    $( "circle.control-node" ).velocity( "stop", true );
                }
            } );
    }

    export function incrementLevel( maze: MazeGraph ): void {

        const urlArray = window.location.href.split( "&" );
        maze.currentLevel += 1;
        urlArray[3] = `l=${maze.currentLevel}`;
        history.pushState( null,
            null,
            urlArray[0] + "&" + urlArray[1] + "&" + urlArray[2] + "&" + urlArray[3] );

        const newLevelDisplay = `Level :: ${maze.currentLevel}`;

        $( "#currentLevel-display" ).text( newLevelDisplay );
    }
}