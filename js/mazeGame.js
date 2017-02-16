'use strict';

class MazeGame {
    constructor(size) {
        this.OPPOSITE = {N:'S', S:'N', E:'W', W:'E'};
        this.startCell = null;
        this.endCell = null;
        this.inMaze = [];
        this.frontiers = [];
        this.size = size;
        this.playerMoves = [];

        this.maze = this.initMaze(size);

        let x = Math.floor((Math.random() * this.maze.length-1) + 1);
        let y = Math.floor((Math.random() * this.maze.length-1) + 1);

        this.currCell = this.createCell({location:{x, y}});
        this.mark(this.currCell);

        this.createMaze();

        Graphics.initialize(size);
        this.myTexture = Graphics.Texture({});

        this.inputDispatch = {
            // [38]: toggleHint, // H
            // [39]: toggleBreadcrumbs, // B
            // [40]: togglePath, // P
            // [37]: toggleScore, // Y

            [87]: {N: 'N', move: this.myTexture.moveNorth}, // w
            [68]: {E: 'E', move: this.myTexture.moveEast}, // d
            [83]: {S: 'S', move: this.myTexture.moveSouth}, // s
            [65]: {W: 'W', move: this.myTexture.moveWest}, // a

            [73]: {N: 'N', move: this.myTexture.moveNorth}, // i
            [76]: {E: 'E', move: this.myTexture.moveEast}, // l
            [75]: {S: 'S', move: this.myTexture.moveSouth}, // k
            [74]: {W: 'W', move: this.myTexture.moveWest}, // j

            [38]: {N: 'N', move: this.myTexture.moveNorth}, // ^
            [39]: {E: 'E', move: this.myTexture.moveEast}, // >
            [40]: {S: 'S', move: this.myTexture.moveSouth}, // <
            [37]: {W: 'W', move: this.myTexture.moveWest}, // V
        };
    }

    initMaze(size) {
        let maze = [];
        for(let i = 0; i < size; i++) {
            let cols = [];
            for(let j = 0; j < size; j++) {
                cols[j] = 0;
            }
            maze[i] = cols;
        }
        return maze;
    }

// ****** helper functions ******
    randomProperty(obj) {
        let keys = Object.keys(obj);
        let dir = keys[ keys.length * Math.random() << 0];
        let cell = obj[dir];
        return {dir, cell};
    }

    keyDown(e, elapsedTime) {
        // console.log(e.key , e.keyCode);
        if (this.inputDispatch.hasOwnProperty(e.keyCode)) {
            let input = this.inputDispatch[e.keyCode].move(elapsedTime, this.maze, this.currCell);
            this.maze = input.maze;
            this.currCell = (input.currCell) ? input.currCell : this.currCell;
        }
    }
// ****** helper functions end ******

// ****** maze functions ******
    addFrontier(x, y) {
        let index = _.findIndex(this.frontiers, {x, y});
        if(x >= 0 && y >= 0 && y < this.maze.length && x < this.maze.length && index === -1 && this.maze[x][y] === 0) {
            this.frontiers.push({x, y});
        }
    }

    findNeighbors(cell) {
        let x = cell.location.x;
        let y = cell.location.y;
        let neighbors = {};

        if(y > 0 && _.findIndex(this.inMaze, this.maze[x][y-1]) !== -1) {
            neighbors.N = {x, y:y-1};
        }

        if(x+1 < this.maze.length && _.findIndex(this.inMaze, this.maze[x+1][y]) !== -1) {
            neighbors.E = {x:x+1, y};
        }

        if(y+1 < this.maze.length && _.findIndex(this.inMaze, this.maze[x][y+1]) !== -1) {
            neighbors.S = {x, y:y+1};
        }

        if(x > 0 && _.findIndex(this.inMaze, this.maze[x-1][y]) !== -1) {
            neighbors.W = {x:x-1, y};
        }

        return neighbors;
    }

    setStartEnd() {
        let cornerStart = [{x:0, y:0},{x:this.maze.length-1, y:0},{x:this.maze.length-1, y:this.maze.length-1},{x:0, y:this.maze.length-1}];
        let cornerEnd = [{x:this.maze.length-1, y:this.maze.length-1},{x:0, y:this.maze.length-1},{x:0, y:0},{x:this.maze.length-1, y:0}];
        let index = Math.floor(Math.random() * 4);

        let start = cornerStart[index];
        let end = cornerEnd[index];

        this.maze[start.x][start.y].isStart = true;
        this.maze[start.x][start.y].isCurrent = true;
        this.startCell = this.maze[start.x][start.y];
        this.currCell = this.maze[start.x][start.y];

        this.maze[end.x][end.y].isFinish = true;
        this.endCell = this.maze[end.x][end.y];
    }

    shortestPathWrapper() {
        let shortestPath = this.shortestPath();
        let curr = shortestPath.current;
        let maze = shortestPath.maze;

        while(curr.parent) {

            maze[curr.location.x][curr.location.y].isShortestPath = true;
            curr = maze[curr.parent.x][curr.parent.y];

            this.draw();
            this.maze = maze;
        }
    }

    shortestPath() {
        // find this once.  Then during the moving process you push and pop off the stack,  if you move along the shortest path then you pop off the stack,  If you move away from the shortest path you push on top of the stack.
        let maze = this.maze;
        let start = this.currCell;
        let end = this.endCell;
        let current;

        let S = [];
        let Q = [];

        maze[start.location.x][start.location.y].parent = null;
        Q.push(this.startCell);

        while(Q.length > 0) {
            current = Q.pop();

            if(current.location === end.location) {
                break;
                // return {current, maze};
            }

            _.each(current.directions, (val, key)=>{
                if(val) {
                    if(_.indexOf(S, val) === -1) {
                        S.push(val);
                        maze[val.x][val.y].parent = current.location;
                        Q.push(maze[val.x][val.y]);
                    }
                }
            });
        }

        let x = maze.length;
        let y = maze.length;
        let path = [];

        let curr = current;

        while(!curr.isStart) {
            let parent = maze[x][y].parent;

            curr = maze[parent.x][parent.y];

            path.push(curr);
        }

        return path;
    }
// ****** maze functions end ******
// ****** create functions ******
    createCell(specs) {
        let that = {};

        that.location = (specs.location) ? specs.location : console.log("missing location");
        that.directions = {N: false, E: false, S: false, W: false};
        that.isStart = false;
        that.isFinish = false;
        that.isCurrent = false;
        that.isVisited = false;
        that.isShortestPath = false;
        that.parent = null;

        return that;
    }

    createMaze() {
        // this using the Prim's Algo to create the maze
        while(this.frontiers.length > 0) {
            let nextCell = this.frontiers.splice(Math.floor(Math.random() * this.frontiers.length), 1)[0]; // find next sell from frontier cells
            nextCell = this.createCell({location:nextCell});
            this.mark(nextCell); // add cell to maze, move to cell

            let neighbor = this.randomProperty(this.findNeighbors(nextCell));

            let dir = neighbor.dir;
            let dirOpp = this.OPPOSITE[dir];

            nextCell.directions[dir] = neighbor.cell;
            this.maze[nextCell.location.x][nextCell.location.y] = nextCell;
            this.maze[neighbor.cell.x][neighbor.cell.y].directions[dirOpp] = nextCell.location;

            this.currCell = nextCell;
        }

        this.setStartEnd();
    }

    mark(cell) {
        let x = cell.location.x;
        let y = cell.location.y;

        this.maze[x][y] = cell;
        this.inMaze.push(cell);

        this.addFrontier(x-1, y);
        this.addFrontier(x+1, y);
        this.addFrontier(x, y-1);
        this.addFrontier(x, y+1);
    }
// ****** create functions end ******

// ****** render functions ******
    drawMaze() {

        for(let x in this.maze) {
            for(let y in this.maze[x]) {
                let cell = Graphics.Cell(this.maze[x][y]);
                cell.draw();
            }
        }
    }
// ****** render functions end ******
}