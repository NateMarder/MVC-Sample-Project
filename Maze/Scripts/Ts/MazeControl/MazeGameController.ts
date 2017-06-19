

namespace MazeApp {

    export class MazeGameController {

        public constructor( model: any ) {

            let maze: MazeGraph;
            const spacing = defaultLineSpacing();

            // maze from bundle
            if ( model !== null && model.MazeHash !== null) {
                const bundle = this.parseMazeHash( model.MazeHash );
                maze = new MazeGraph( spacing, bundle, 0 );
                var controlZone = new UserControlHandler( maze );
            }
            // start normal mode
            else {
                maze = new MazeGraph( spacing, null, 1 );
                const mazeGenerator = new MazeGenerator.LevelOne( maze ).run();
                const compressionHandler = new CompressionHandler( maze );
                var controlZone = new UserControlHandler( maze );
            }
        }

        private parseMazeHash( hash: string ): IMazeBundle {

            let hex = "";
            let cols = 0;
            let rows = 0;
            let level = 1;

            const data = hash.split( "&" );

            for ( let i = 0; i < data.length; i++ ) {
                const dataParts = data[i].split( "=" );
                const [type, content] = dataParts;
                if ( type === "n" ) {
                    hex = content;
                } else if ( type === "c" ) {
                    cols = +content;
                } else if ( type === "r" ) {
                    rows = +content;
                } else if ( type === "l" ) {
                    level = +content;
                }
            }

            return {
                hexstring: hex,
                cols: cols,
                rows: rows,
                level: level
            };
        }
    }
}
