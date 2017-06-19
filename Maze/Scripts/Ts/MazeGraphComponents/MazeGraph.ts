
namespace MazeApp {

    export interface INodeHandler {
        nodes: { [key: string]: MazeNode }
    }

    export class MazeGraph implements INodeHandler {

        nodes: { [key: string]: MazeNode } = {};
        paths: { [key: string]: MazePath } = {};
        wallsInactive: { [key: string]: MazeWall } = {};
        wallsActive: { [key: string]: MazeWall } = {};
        controlNode: ControlNode;
        aiNode: ArtificialIntelligenceNode;
        solutionNodes: string[] = null;
        mazeSolver: MazeSearchers.Dijskstra;
        solutionPathTimeOut: any = null;
        currentLevel: number;
        hexString: string;
        svg: SVGSVGElement;
        startKey: string;
        endKey: string;
        spacing: number;
        cols: number;
        rows: number;
        container: JQuery;
        tempWall: HTMLElement;
        wallFlag: Boolean;
        bundle: IMazeBundle;
        raceTime1: number;
        raceTime2: number;

        public constructor( spacing?: number, bundle?: IMazeBundle, level?: number ) {

            this.container = $( "#svg-container" );
            this.currentLevel = level == null ? 1 : level;

            if ( bundle == null ) {
                this.spacing = spacing == null ? defaultLineSpacing() : spacing;
                this.scratchBuild();
            } else {
                this.bundleBuild( bundle );
            }

            this.mazeSolver = new MazeSearchers.Dijskstra( this );
        }

        private scratchBuild(): void {
            this.getMediaDimensions( false );
            this.createAndAppendSvgElement();
            this.setUpNodes();
            this.setUpPaths();
            this.setUpWalls();
        }

        private bundleBuild( bundle: IMazeBundle ): void {
            this.bundle = bundle;
            this.getMediaDimensions( true );
            this.createAndAppendSvgElement();
            this.setUpNodes();
            this.setupPathsWithBundle( bundle );
            this.setUpWalls();
        }

        private getMediaDimensions( bundle: boolean ): void {

            const defaultSpacing = defaultLineSpacing();
            const mzHeight = ( Math.round( window.innerHeight - defaultSpacing ) );
            let mzWidth = ( Math.round( window.innerWidth ) );
            $( ".content" ).height( mzHeight );

            mzWidth -= defaultSpacing; // padding

            if ( bundle ) {
                this.cols = this.bundle.cols;
                this.rows = this.bundle.rows;
                this.currentLevel = this.bundle.level;
                this.hexString = this.bundle.hexstring;
                const rqrdColSpacing = Math.round( mzWidth / this.cols );
                const rqrdRowSpacing = Math.round( mzHeight / this.rows );
                this.spacing = rqrdColSpacing >= rqrdRowSpacing ? rqrdColSpacing : rqrdRowSpacing;

                if ( this.spacing > defaultSpacing ) {
                    this.spacing = defaultSpacing;
                }

                while ( this.spacing % 10 !== 0 ) {
                    this.spacing -= 1;
                }
            } else {
                this.cols = Math.floor( mzWidth / this.spacing ) - 1;
                this.rows = Math.floor( mzHeight / this.spacing ) - 1;
                this.cols = this.cols % 2 === 0 ? this.cols : this.cols - 1;
                this.rows = this.rows % 2 === 0 ? this.rows : this.rows - 1;
                this.currentLevel = this.currentLevel == null ? 1 : this.currentLevel;
            }
        }

        private setupPathsWithBundle( bundle: IMazeBundle ): void {

            let nodeCounter = 0;
            const keys = Object.keys( this.nodes ).sort();
            for ( let i = 0; i < bundle.hexstring.length; i++ ) {

                const key1 = keys[nodeCounter++];
                const key2 = keys[nodeCounter++];
                const nextHex = bundle.hexstring.charAt( i ).toString();
                const nodes = this.getDirectionsWithDoubleCompressedHex( nextHex, key1, key2 );

                for ( let j = 0; j < nodes[0].siblings.length; j++ ) {
                    const nextSibKey = nodes[0].siblings[j];
                    if ( nextSibKey != null ) {
                        this.addPath( new MazePath( key1, nextSibKey ) );
                    }
                }

                for ( let j = 0; j < nodes[1].siblings.length; j++ ) {
                    const nextSibKey = nodes[1].siblings[j];
                    if ( nextSibKey != null ) {
                        this.addPath( new MazePath( key2, nextSibKey ) );
                    }
                }
            }
        }

        private createAndAppendSvgElement(): void {
            this.svg = document.createElementNS( "http://www.w3.org/2000/svg", "svg" );
            this.svg.setAttribute( "xmlns:xlink", "http://www.w3.org/1999/xlink" );
            this.svg.setAttribute( "width", ( this.cols * this.spacing ).toString() );
            this.svg.setAttribute( "height", ( this.rows * this.spacing ).toString() );
            this.svg.setAttribute( "id", "mz-svg" );
            this.container.append( this.svg );
        }

        private setUpWalls(): void {
            let x1: number;
            let x2: number;
            let y1: number;
            let y2: number;

            // vertical walls
            for ( let i = 1; i <= this.cols - 1; i++ ) {
                for ( let j = 0; j < this.rows; j++ ) {
                    x1 = x2 = i * this.spacing;
                    y1 = j * this.spacing;
                    y2 = y1 + this.spacing;
                    this.addWall( new MazeWall( x1, y1, x2, y2, "mz-wall" ) );
                }
            }

            // horizontal walls
            for ( let i = 1; i <= this.rows - 1; i++ ) {
                for ( let j = 0; j < this.cols; j++ ) {
                    y1 = y2 = i * this.spacing;
                    x1 = j * this.spacing;
                    x2 = x1 + this.spacing;
                    this.addWall( new MazeWall( x1, y1, x2, y2, "mz-wall" ) );
                }
            }
        }

        private setUpNodes(): void {

            const offset = this.spacing / 2;

            for ( let i = 0; i < this.cols; i++ ) {
                for ( let j = 0; j < this.rows; j++ ) {
                    const x = ( i * this.spacing ) + offset;
                    const y = ( j * this.spacing ) + offset;
                    this.nodes[x + "." + y] = new MazeNode( x, y, this.spacing );
                }
            }

            const startNode = this.nodes[Object.keys( this.nodes )[0]];
            startNode.setAsStartNode( this );

            const endNode = this.nodes[Object.keys( this.nodes )[Object.keys( this.nodes ).length - 1]];
            endNode.setAsEndNode( this );

        }

        private setUpPaths(): void {
            let x1: number;
            let x2: number;
            let y1: number;
            let y2: number;
            const r = this.spacing;
            const r2 = Math.round( r / 2 );

            // vertical paths
            for ( let i = 0; i < this.cols; i++ ) {
                for ( let j = 0; j < this.rows - 1; j++ ) {
                    x1 = x2 = i * r;
                    y1 = j * r;
                    y2 = y1 + r;
                    x1 += r2;
                    x2 += r2;
                    y1 += r2;
                    y2 += r2;
                    this.addPath( new MazePath( x1 + "." + y1, x2 + "." + y2 ) );
                }
            }

            //horizontal paths
            for ( let i = 0; i < this.rows; i++ ) {
                for ( let j = 0; j < this.cols - 1; j++ ) {
                    y1 = y2 = i * r;
                    x1 = j * r;
                    x2 = x1 + r;
                    x1 += r2;
                    x2 += r2;
                    y1 += r2;
                    y2 += r2;
                    this.addPath( new MazePath( x1 + "." + y1, x2 + "." + y2 ) );
                }
            }
        }

        private addPath( path: MazePath ): boolean {
            this.paths[path.id] = path;
            const node1 = this.nodes[path.mazeNodes[0]];
            const node2 = this.nodes[path.mazeNodes[1]];

            if ( node1 != null && node2 != null ) {
                if ( node1.siblings.indexOf( node2.key ) < 0 ) {
                    node1.siblings.push( node2.key );
                }
                if ( node2.siblings.indexOf( node1.key ) < 0 ) {
                    node2.siblings.push( node1.key );
                }
                return true;
            }
            return false;
        }

        private addWall( wall: MazeWall ) {

            if ( this.paths[wall.crossPath] != null ) {
                this.wallsInactive[wall.id] = wall;
                this.svg.appendChild( wall.svg );
            } else {
                this.wallsActive[wall.id] = wall;
                wall.svg.setAttribute("class","mz-wall wall-active");
                this.svg.appendChild( wall.svg );
            }
        }

        private activateInactiveWall( item: Element ): void {

            const w = this.wallsInactive[item.id];
            this.wallsInactive[item.id] = null;
            this.wallsActive[item.id] = new MazeWall( w.x1, w.y1, w.x2, w.y2, "mz-wall wall-active" );
            this.svg.appendChild( this.wallsActive[item.id].svg );
            this.removePathUsingWallKey( item.id );
        }

        deactivateWallUsingWallKey( key: string ): void {

            const locations = key.split( "." );
            const x1 = +locations[0];
            const y1 = +locations[1];
            const x2 = +locations[2];
            const y2 = +locations[3];

            let wall = this.wallsActive[key];

            if ( wall == null ) {
                wall = this.wallsInactive[key];
            }

            if ( wall != null ) {
                this.svg.removeChild( wall.svg );
                this.wallsInactive[key] = this.wallsActive[key] = null;
            }

            const newWall = new MazeWall( x1, y1, x2, y2, "mz-wall" );
            this.wallsInactive[newWall.id] = newWall;
            this.addPath( newWall.path );
            this.svg.appendChild( newWall.svg );
        }

        activateAllWalls(): void {
            const wallsInactive = this.wallsInactive;
            for ( let key in wallsInactive ) {
                if ( wallsInactive.hasOwnProperty( key ) ) {
                    this.activateInactiveWall( this.wallsInactive[key].element );
                }
            }
        }

        private removePathUsingWallKey( wallKey: string ): void {
            const pathKey = this.wallsActive[wallKey].crossPath;
            const [nodeKey1, nodeKey2] = this.paths[pathKey].mazeNodes;

            //update node siblings accordingly
            let index = this.nodes[nodeKey1].siblings.indexOf( nodeKey2 );
            if ( index > -1 ) {
                this.nodes[nodeKey1].siblings.splice( index, 1 );
            }
            index = this.nodes[nodeKey2].siblings.indexOf( nodeKey1 );
            if ( index > -1 ) {
                this.nodes[nodeKey2].siblings.splice( index, 1 );
            }

            this.paths[pathKey] = null;
        }

        private getDirectionsWithDoubleCompressedHex( hex: string, nodeKey1: string, nodeKey2: string ): MazeNode[] {

            const right = Direction.Right;
            const down = Direction.Down;

            const dirs = transformHexToDirection( hex );
            const node1 = this.nodes[nodeKey1];
            const node2 = this.nodes[nodeKey2];

            if ( node1 == null || node2 == null ) {
                console.log( "null node error happened: getDirectionsWithDoubleCompressedHex" );
                return null;
            }

            if ( dirs[0] === "1" ) {
                node1.pathDirections.push( right );
            }
            if ( dirs[1] === "1" ) {
                node1.pathDirections.push( down );
            }
            if ( dirs[2] === "1" ) {
                node2.pathDirections.push( right );
            }
            if ( dirs[3] === "1" ) {
                node2.pathDirections.push( down );
            }

            node1.transformDirectionsToSiblingKeys();
            node2.transformDirectionsToSiblingKeys();

            return [node1, node2];
        }
    }
}