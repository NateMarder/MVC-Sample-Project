
namespace MazeSearchers {
    export class Dijskstra {
        private readonly maze:MazeApp.INodeHandler;
        //private readonly mazeArrayNode: MazeApp.MazeGraphArrayNode;
        private q: any[];
        private startKey: string;
        private destKey: string;
        private path: string[];
        private maxdist = 999999;
        private startNodeIndex = -1;
        private minPathsToStart: any;
        private maxQueSize: number;
        private solveNeeded: boolean = true;
        private continuousRunIntervalId: number;
        private solvedPath: SVGPathElement;
        private controlNode: Element;
        private solution:string[];

        public constructor( maze: MazeApp.INodeHandler ) {
            this.maze = maze;
            this.refreshData();
        }

        private refreshData() {
            this.q = [];
            this.minPathsToStart = {};
            let index = 0;
            this.maxQueSize = 0;
            const nodes = this.maze.nodes;
            for ( let key in nodes ) {
                if ( nodes.hasOwnProperty( key ) ) {
                    const nextNode = nodes[key];
                    let dist = nextNode.isStart ? 0 : this.maxdist;
                    let isDest = false;
                    let distKnown = false;
                    let currIndex = -1;
                    let siblingKeys: string[] = [];
                    let minPathNeighbor = "unknown";
                    if ( typeof ( nextNode.siblings ) != "undefined" ) {
                        if ( nextNode.siblings != null ) {
                            siblingKeys = nextNode.siblings;
                        }
                    }

                    if ( nextNode.isStart ) {
                        this.startKey = nextNode.key;
                        this.startNodeIndex = index;
                        dist = 0;
                        distKnown = true;
                        currIndex = 0;
                        minPathNeighbor = null;
                    }
                    else if ( nextNode.isEnd ) {
                        this.destKey = nextNode.key;
                        isDest = true;
                    }

                    this.q.push( {
                        key: nextNode.key,
                        distFromStart: dist,
                        isDest: isDest,
                        distKnown: distKnown,
                        siblingKeys: siblingKeys,
                        currIndex: currIndex,
                        minPathNeighbor: minPathNeighbor,
                    });

                    index += 1;
                }
            }
            this.maxQueSize = index;
        }

        translateToPath( minpathData: any[] ): any {
            const nodeArray = [];
            let nextNode = minpathData[this.destKey];
            while ( ( typeof ( nextNode ) != "undefined" ) ) {
                nodeArray.push( nextNode.self );
                nextNode = minpathData[nextNode.from];
            }
            return nodeArray.reverse();
        }

        run(): string[] {
            if ( !this.solveNeeded ) {
                return this.solution;
            }
            else {
                this.refreshData();
                const nodes = this.maze.nodes;
                for ( let key in nodes ) {
                    if ( nodes.hasOwnProperty( key ) ) {
                        nodes[key].isVisited = false;
                    }
                }
                const solutionExists = this.runAlgorithm();
                if (solutionExists) {
                    this.solution = this.translateToPath(this.minPathsToStart);
                    this.solveNeeded = false;
                    return this.solution;
                }
                return null;
            }
        }

        private getIndexWithKey( searchKey: string, collection: any[] ): number {
            for ( let i = 0; i < collection.length; i++ ) {
                if ( collection[i].key === searchKey ) {
                    return i;
                }
            }
            return -1;
        }

        runAlgorithm(): boolean {

            let start = this.q[this.startNodeIndex];
            let priorityQue: any = {};
            let paths: any[] = [];

            priorityQue[this.startKey] =
                {
                    key: this.startKey,
                    distFromStart: 0,
                    isDest: false,
                    distKnown: true,
                    siblingKeys: start.siblingKeys,
                    minPathNeighbor: null
                };
            let priorityNode = priorityQue[this.startKey];
            let destNodeFound = false;

            while ( !priorityNode.isDest && paths.length < this.maxQueSize ) {
                // explore currMin paths
                for ( let i = 0; i < priorityNode.siblingKeys.length; i++ ) {
                    let sibKey = priorityNode.siblingKeys[i];
                    let sibling = priorityQue[sibKey];

                    // add new guy to our map if need be
                    if ( typeof ( sibling ) == "undefined" ) {
                        let sibIndexInQ = this.getIndexWithKey( priorityNode.siblingKeys[i], this.q );
                        let ogSibling = this.q[sibIndexInQ];

                        priorityQue[priorityNode.siblingKeys[i]] =
                            {
                                key: priorityNode.siblingKeys[i],
                                distFromStart: priorityNode.distFromStart + 1,
                                isDest: this.q[sibIndexInQ].isDest,
                                distKnown: false,
                                siblingKeys: this.q[sibIndexInQ].siblingKeys,
                                minPathNeighbor: "uknown",
                            };
                        if ( ogSibling.isDest ) {
                            destNodeFound = true;
                        }

                        sibling = priorityQue[priorityNode.siblingKeys[i]];
                    }

                    if ( sibling != null && sibling.key != this.startKey ) {
                        if ( typeof ( sibling.distFromStart ) == "undefined" || ( sibling.distFromStart == null ) ) {
                            priorityQue[priorityNode.siblingKeys[i]]
                                .distFromStart = priorityNode.distFromStart + 1;
                        }

                        if ( sibling.distFromStart > priorityNode.distFromStart + 1 ||
                            ( sibling.distFromStart == null ) ) {
                            sibling.distFromStart = priorityNode.distFromStart + 1;
                        }
                    }
                }

                // update minPriorityQue
                let lastPriorityNode = priorityNode;
                let isStart = priorityNode.key.toString() == this.startKey;
                priorityQue[lastPriorityNode.key] = null;

                // get current priority-node (node with min distFromStart dx)
                let itemsInPriorityQue = 0;
                let min = this.maxdist;
                for ( let key in priorityQue ) {
                    if ( priorityQue.hasOwnProperty( key ) ) {
                        itemsInPriorityQue += 1;
                        if ( priorityQue[key] != null ) {
                            if ( priorityQue[key].distFromStart < min ) {
                                min = priorityQue[key].distFromStart;
                                priorityNode = priorityQue[key];
                            }
                        }
                    }
                }

                if ( itemsInPriorityQue === 0 ) {
                    return destNodeFound;
                }
                else {
                    // fromKey must be a sibling (sibling in minpath with lowest)
                    let fromKey = "unknown";
                    if ( priorityNode.siblingKeys.indexOf( lastPriorityNode.key ) > -1 ) {
                        priorityNode.minPathNeighbor = lastPriorityNode.key;
                        fromKey = lastPriorityNode.key;
                    }
                    else {
                        priorityNode.minPathNeighbor = "unknown";
                        for ( let i = paths.length - 1; i > -1; i-- ) {
                            let pathItem = paths[i].self;
                            if ( priorityNode.siblingKeys.indexOf( pathItem ) > -1 ) {
                                fromKey = pathItem;
                                priorityNode.minPathNeighbor = fromKey;
                                break;
                            }
                        }
                    }

                    let nextMinPathObject = {
                        start: isStart,
                        self: priorityNode.key,
                        from: fromKey,
                    };

                    this.minPathsToStart[priorityNode.key] = nextMinPathObject;
                    paths.push( nextMinPathObject );
                }
            }

            return destNodeFound;
        }

        getSolutionData(): any {
            const minPath = this.translateToPath( this.minPathsToStart );
        }
    }
}