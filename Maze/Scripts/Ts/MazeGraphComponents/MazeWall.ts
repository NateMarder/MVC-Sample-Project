
namespace MazeApp {

    export class MazeWall {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
        css = "";
        crossPath: string;
        svg: SVGLineElement;
        element: Element;
        id: string;
        length: number;
        isBorder: boolean;
        path: MazePath;

        public constructor(x1: number, y1: number, x2: number, y2: number, css: string, mazeIndex?: string) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.id = x1 + "." + y1 + "." + x2 + "." + y2;
            if (mazeIndex != undefined) {
                this.id = this.id + "." + mazeIndex;
            }
            this.length = (x1 === x2) ? Math.round(y2 - y1) : Math.round(x2 - x1);
            this.crossPath = this.getPathKey();
            this.css = css;
            this.isBorder = this.css.match("/border-wall/") ? true : false;
            this.svg = document.createElementNS("http://www.w3.org/2000/svg", "line");
            this.svg.setAttribute("x1", this.x1.toString());
            this.svg.setAttribute("y1", this.y1.toString());
            this.svg.setAttribute("x2", this.x2.toString());
            this.svg.setAttribute("y2", this.y2.toString());
            this.svg.setAttribute("id", this.id.toString());
            this.svg.setAttribute("class", this.css);
            this.element = this.svg;
            this.path = this.getMazePath();
        }

        getPathKey() {
            const d = Math.round(this.length / 2);
            let pX1: number;
            let pY1: number;
            let pX2: number;
            let pY2: number;

            if (this.x1 === this.x2) // vertical wall
            {
                pX1 = this.x1 - d;
                pY1 = this.y1 + d;
                pX2 = this.x1 + d;
                pY2 = this.y1 + d;
            } else {
                pX1 = this.x1 + d;
                pY1 = this.y1 - d;
                pX2 = this.x1 + d;
                pY2 = this.y1 + d;
            }

            return pX1 + "." + pY1 + "." + pX2 + "." + pY2;
        }

        getMazePath(): MazePath {

            if (this.path == null) {
                const pathKey = this.crossPath.split(".");
                const n1 = pathKey[0] + "." + pathKey[1];
                const n2 = pathKey[2] + "." + pathKey[3];
                this.path = new MazePath(n1, n2);
            }

            return this.path;
        }
    }
}