

namespace MazeApp {

    export class MazePath {
        mazeNodes: string[] = [];
        style: string;
        id: string;
        crossWall: string;

        public constructor(s1: string, s2: string) {

            const key1 = s1;
            const key2 = s2;

            this.mazeNodes.push(key1);
            this.mazeNodes.push(key2);
            this.style = "mz-path";
            this.id = key1 + "." + key2;

            const splitKeyOne = key1.split(".");
            const splitKeyTwo = key2.split(".");

            const x1 = splitKeyOne[0];
            const y1 = splitKeyOne[1];
            const x2 = splitKeyTwo[0];
            const y2 = splitKeyTwo[1];

            this.crossWall = getOrthogonalKey(+x1, +y1, +x2, +y2);
        }
    }
}

