
namespace MazeGenerator {

    export class LevelOne implements MazeApp.INodeHandler {

        private nodes1: any[];
        nodes: { [key: string]: MazeApp.MazeNode } = {};
        private maze: any;
        private startNode: MazeApp.MazeNode;
        private wallsToDeactivate: string[];
        dataReady:boolean = false;

        public constructor( maze?: MazeApp.INodeHandler ) {
            if (maze != null) {
                this.maze = maze;
                this.nodes = maze.nodes;
                this.prepareLocalDataStore();
            }
        }

        private prepareLocalDataStore(): void {

            if (this.dataReady) {
                return;
            }

            this.wallsToDeactivate = [];
            const keys = Object.keys( this.nodes );

            for ( let i = 0; i < keys.length; i++ ) {
                const key = keys[i];
                this.nodes[key].isVisited = false;
                this.nodes[key].discoveredBy = null;
                this.nodes[key].siblings = MazeApp.shuffle( this.nodes[key].siblings );

                if ( this.nodes[key].isStart ) {
                    this.startNode = this.nodes[key];
                    this.startNode.isVisited = true;
                }
            }

            this.dataReady = true;
        }

        run( maze?: MazeApp.INodeHandler ): void {

            if ( maze != null ) {
                this.dataReady = false;
                delete this.maze;
                delete this.nodes;
                this.maze = maze;
                this.nodes = maze.nodes;
            }

            this.prepareLocalDataStore();
            this.generateMazeWithDfs();
            this.dataReady = false;
            this.maze.activateAllWalls();

            for ( let wall of this.wallsToDeactivate ) {
                this.maze.deactivateWallUsingWallKey( wall );
            }
        }

        private generateMazeWithDfs(): void {

            const stack: any[] = [];
            this.push( stack, this.startNode );

            while ( stack.length > 0 ) {

                const w: MazeApp.MazeNode = this.pop( stack );

                if ( w != undefined ) {
                    this.visit( w );
                    for ( let sibKey of w.siblings ) {
                        const sib = this.nodes[sibKey];
                        if ( !sib.isVisited ) {
                            sib.discoveredBy = w.key;
                            this.push( stack, sib );
                        }
                    }
                }
            }
        }

        private visit( n: MazeApp.MazeNode ): void {
            
            if ( n !== this.startNode ) {
                n.isVisited = true;
                const disc = n.discoveredBy.split( "." );
                const wallKey = MazeApp.getOrthogonalKey( +disc[0], +disc[1], +n.cx, +n.cy );
                this.wallsToDeactivate.push( wallKey );
            }
        }

        private push( array: any[], node: any ): void {
            array.unshift( node );
        }

        private pop( array: any[] ): any {
            return array.shift();
        }
    }
}
