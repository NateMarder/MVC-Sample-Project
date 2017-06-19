
namespace MazeApp {

    export class CompressionHandler {

        private readonly nodes: { [key: string]: MazeNode };
        private readonly nodeKeys: string[];
        private shareLink = "";
        private readonly maze: MazeGraph;
        private hex: string;
        private cols: number;
        private rows: number;
        private spacing: number;
        private bundle: IMazeBundle;
        private level: number;

        public constructor( maze: MazeGraph ) {
            if ( maze != null ) {
                this.maze = maze;
                this.ensureNodesHavePathDirections( this.maze );
                this.hex = this.exportNodesAsHex( this.maze );
                this.shareLink = this.constructUrlFromCurrentMazeData();
                history.pushState( null, null, this.shareLink );
            } else {
                this.updateBundleWithUrlData();
            }
        }

        private exportNodesAsHex( maze: MazeGraph ): string {

            let hx = "";
            const nodeKeys = Object.keys( maze.nodes ).sort();
            for ( let i = 0; i < nodeKeys.length - 1; i += 2 ) {

                let binary = "";
                const node1Paths = maze.nodes[nodeKeys[i]].pathDirections;
                const node2Paths = maze.nodes[nodeKeys[i + 1]].pathDirections;

                binary += node1Paths.indexOf( Direction.Right ) > -1 ? "1" : "0";
                binary += node1Paths.indexOf( Direction.Down ) > -1 ? "1" : "0";
                binary += node2Paths.indexOf( Direction.Right ) > -1 ? "1" : "0";
                binary += node2Paths.indexOf( Direction.Down ) > -1 ? "1" : "0";

                const numberVal = parseInt( binary, 2 );
                hx += getHexFromDecimalString( numberVal );
            }

            return hx;
        }

        private constructUrlFromCurrentMazeData(): string {

            // trim off the old url params if they are there
            return window.location.href.split( "?" )[0] +
                "?" +
                `n=${this.hex}&` +
                `c=${this.maze.cols}&` +
                `r=${this.maze.rows}&` +
                `l=${this.maze.currentLevel}`;
        }

        private updateBundleWithUrlData() {

            let urlParams = "";
            if ( window.location.href.indexOf( "?" ) > -1 ) {
                urlParams = window.location.href.split( "?" )[1];
            }

            const data = urlParams.split( "&" );

            for ( let i = 0; i < data.length; i++ ) {
                const dataParts = data[i].split( "=" );
                const [type, content] = dataParts;
                if ( type === "n" ) {
                    this.hex = content;
                } else if ( type === "c" ) {
                    this.cols = +content;
                } else if ( type === "r" ) {
                    this.rows = +content;
                } else if ( type === "l" ) {
                    this.level = +content;
                }
            }
            if ( this.level == null ) {
                this.level = 1;
            }
            this.bundle = {
                hexstring: this.hex,
                cols: this.cols,
                rows: this.rows,
                level: this.level,
            };
        }

        getMazeBundle(): IMazeBundle {

            if ( this.bundle == null ) {
                this.updateBundleWithUrlData();
            }

            return this.bundle;
        }

        private ensureNodesHavePathDirections( maze: MazeGraph ): void {
            const nodeKeys = Object.keys( maze.nodes ).sort();
            for ( let n of nodeKeys ) {
                maze.nodes[n].transformSiblingKeysToDirections();
            }
        }
    }
}