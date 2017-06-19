
namespace MazeApp {

    let currentLevel = 1;
    let privateLevel: number = null;


    
    export interface IPoint {
        x: number,
        y: number,
    }

    export interface IUserControlInitParams {
        cx: number,
        cy: number,
        r: number,
        offset: number,
        options?: any,
        ai: boolean,
        maze: MazeGraph,
    }



    export interface IMazeBundle {
        hexstring: string,
        cols: number,
        rows: number,
        level?: number,
    }

    export const defaultLineSpacing = () => {

        const type = detectDeviceType();

        if (type === DeviceType.Desktop) {
            return 50;
        } else {
            return 80;
        }

    };
  
    export const controlSpeed = () => {
        return 50;
    };
  
    export const goHomeSpeed = () => {
        return 500; //milliseconds
    };

    export enum DeviceType {
        Mobile = 0,
        Desktop = 1,
        Tablet = 2,
    }

    let deviceTypes = [DeviceType.Mobile, DeviceType.Desktop, DeviceType.Tablet];

    export enum Direction {
        Up = 0,
        Right = 1,
        Down = 2,
        Left = 3,
    }

    let directions = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];

    export const levelSpeed = {
        One: 400,
        Two: 420,
        Three: 440,
        Four: 450,
        Five: 500,
        Six: 510,
        Seven: 520,
        Eight: 600,
        Nine: 700,
        Ten: 800
    };
    export const aINodeSpeed = {
        "1": 140,
        "2": 120,
        "3": 100,
        "4": 95,
        "5": 90,
        "6": 85,
        "7": 75,
        "8": 65,
        "9": 55,
        "10": 45
    };
}