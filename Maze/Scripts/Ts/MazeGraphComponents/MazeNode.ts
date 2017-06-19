

namespace MazeApp {

    export class MazeNode {

        cx: number;
        cy: number;
        r: number;
        isVisited: boolean;
        discoveredBy: string = "";
        isStart: boolean;
        isEnd: boolean;
        key: string;
        svg: SVGCircleElement;
        siblings: string[] = [];
        isVertex = false;
        pathDirections: Direction[] = [];
        private readonly spacing: number;
        directionsGenerated = false;

        public constructor(x: number, y: number, spacing: number) {

            this.spacing = spacing !== null ? spacing : -1;
            this.cx = x;
            this.cy = y;
            this.r = Math.round(this.spacing * .15);
            this.isVisited = false;
            this.isStart = false;
            this.isEnd = false;
            this.key = x + "." + y;
        }

        setAsStartNode(maze: MazeGraph): void {
            this.isStart = true;
            maze.startKey = this.key;
        }

        setAsEndNode(maze: MazeGraph): void {
            this.svg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            this.svg.setAttribute("cx", this.cx.toString());
            this.svg.setAttribute("cy", this.cy.toString());
            this.svg.setAttribute("r", this.r.toString());
            this.svg.setAttribute("class", "mz-node end-node");
            this.isEnd = true;
            maze.endKey = this.key;
            maze.svg.appendChild(this.svg);
        }

        transformSiblingKeysToDirections(): Boolean {

            if (this.directionsGenerated) {
                return false;
            }

            for (let sibKey of this.siblings) {
                const split = sibKey.split(".");
                const sibX = parseInt(split[0]);
                const sibY = parseInt(split[1]);

                if (sibX !== this.cx) { // horizontal sibling
                    if (sibX < this.cx) {
                        this.pathDirections.push(Direction.Left);
                    } else {
                        this.pathDirections.push(Direction.Right);
                    }
                } else if (sibY !== this.cy) { // vertical sibling
                    if (sibY < this.cy) {
                        this.pathDirections.push(Direction.Up);
                    } else {
                        this.pathDirections.push(Direction.Down);
                    }
                }
            }

            this.pathDirections = this.pathDirections.sort();
            return (this.directionsGenerated = true);
        }

        transformDirectionsToSiblingKeys(): MazeNode {

            for (let i = 0; i < this.pathDirections.length; i++) {

                let sibX = this.cx;
                let sibY = this.cy;
                let sibKey = "";

                const nextDirection = this.pathDirections[i];
                switch (nextDirection) {
                case Direction.Up:
                    sibY -= this.spacing;
                    break;
                case Direction.Right:
                    sibX += this.spacing;
                    break;
                case Direction.Down:
                    sibY += this.spacing;
                    break;
                case Direction.Left:
                    sibX -= this.spacing;
                    break;
                default:
                    break;
                }

                sibKey += sibX + "." + sibY;
                this.siblings.push(sibKey);
            }

            return this;
        }

    }
}