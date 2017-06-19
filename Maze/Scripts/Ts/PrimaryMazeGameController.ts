/// <reference path="../../typings/globals/jquery/index.d.ts" />


namespace MazeApp {

    export class MazeAppController {

        public constructor() {

            //let maze: MazeGraph;
            //const spacing = defaultLineSpacing();

            //// maze from bundle
            //if (window.location.href.indexOf("n=") > -1) {
            //    const compressionHandler = new CompressionHandler(null);
            //    const bundle = compressionHandler.getMazeBundle();
            //    maze = new MazeGraph(spacing, bundle, 0);
            //    var controlZone = new UserControlHandler(maze);
            //}
            //// load into specific level normal mode
            //else if (window.location.href.indexOf("l=") > -1) {
            //    const i = window.location.href.indexOf("=");
            //    const level = +(window.location.href.substr(i + 1));
            //    maze = new MazeGraph(spacing, null, level);
            //    var mazeGenerator = new MazeGenerator.LevelOne(maze).run();
            //    var compressionHandler = new CompressionHandler(maze);
            //    var controlZone = new UserControlHandler(maze);
            //}
            //// start normal mode
            //else {
            //    maze = new MazeGraph(spacing, null, 1);
            //    var mazeGenerator = new MazeGenerator.LevelOne(maze).run();
            //    var compressionHandler = new CompressionHandler(maze);
            //    var controlZone = new UserControlHandler(maze);
            //}

        }
    }



}


document.addEventListener( "DOMContentLoaded",
    () => {
        var app = new MazeApp.MazeAppController();
    } );
