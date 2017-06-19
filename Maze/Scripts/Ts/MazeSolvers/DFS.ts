

namespace MazeSearchers
{
    export class Dfs
    {
        mazeGraph: MazeApp.MazeGraph;
        private solutionPath: string[] = [];

        public constructor(mazeGraph?: MazeApp.MazeGraph)
        {
            this.mazeGraph = mazeGraph;
        }

        iterativeDfs(startNodeKey: string, endNodeKey: string): Boolean
        {
            const alias = this;
            let isSovable = false;
            const v = this.mazeGraph.nodes[startNodeKey];
            const stack: MazeApp.MazeNode[] = [];
            stack.push(v);

            while (stack.length > 0)
            {
                const w = stack.pop();
                this.visit(w);

                if (w.isEnd)
                {
                    isSovable = true;
                    break;
                }

                for (let i = 0; i < w.siblings.length; i++)
                {
                    const nextKey = w.siblings[i];
                    const sibling = alias.mazeGraph.nodes[nextKey];
                    if (!sibling.isVisited)
                    {
                        stack.push(sibling);
                    }
                }
            }

            if (isSovable)
            {
                $("#path-found").show().fadeOut(5000);
            }
            else
            {
                $("#path-not-found").show().fadeOut(5000);
            }

            return isSovable;
        }

        private visit(node: MazeApp.MazeNode)
        {
            node.isVisited = true;

            if (!node.isEnd && !node.isStart)
            {
                $(`#${node.key}`).hide();
                node.svg
                    .setAttribute("class", "mz-node visited-node");
                $(`#${node.key}`).fadeIn(5000);
            }
        }

        setUpRecursiveDfs(startNodeKey: string, endNodeKey: string): void
        {
            const v = this.mazeGraph.nodes[startNodeKey];
            const stack: MazeApp.MazeNode[] = [];
            stack.push(v);
            const canSolve = this.recursiveDfs(startNodeKey, endNodeKey, stack);
            if (canSolve)
            {
                $("#path-found").fadeIn(500,
                    function()
                    {
                        $(this).fadeOut(500);
                    });
            }
            else
            {
                $("#path-not-found").addClass("fa-spin").fadeIn(500,
                    function()
                    {
                        $(this).fadeOut(500);
                    });
            }
        }

        private recursiveDfs(startNodeKey: string, endNodeKey: string, stack: MazeApp.MazeNode[]): boolean
        {
            if (stack.length > 0)
            {
                const w = stack.pop();
                this.visit(w);

                if (w.isEnd)
                {
                    return true;
                }
                else
                {
                    for (let i = 0; i < w.siblings.length; i++)
                    {
                        const nextKey = w.siblings[i];
                        const sibling = this.mazeGraph.nodes[nextKey];
                        if (!sibling.isVisited)
                        {
                            stack.push(sibling);
                        }
                    }
                    return this.recursiveDfs(startNodeKey, endNodeKey, stack);
                }
            }

            return false;
        }
    }
}