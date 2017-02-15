'use strict';

class MazeGame {
    constructor(size) {
        this.OPPOSITE = {N:'S', S:'N', E:'W', W:'E'};
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.startCell = null;
        this.endCell = null;
        this.inMaze = [];
        this.frontiers = [];
        this.size = size;

        CanvasRenderingContext2D.prototype.clear=()=>{
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.restore();
        };

        this.maze = this.initMaze(size);

        let x = Math.floor((Math.random() * this.maze.length-1) + 1);
        let y = Math.floor((Math.random() * this.maze.length-1) + 1);

        this.currCell = this.createCell({location:{x, y}});
        this.mark(this.currCell);

        this.createMaze();
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

    heuristic(pos0, pos1) {
		// This is the Manhattan distance
		let d1 = Math.abs(pos1.x - pos0.x);
		let d2 = Math.abs(pos1.y - pos0.y);
		return d1 + d2;
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

    moveNorth() {
        console.log('moving north');
    }

    moveEast() {
        console.log('moving east');
    }

    moveSouth() {
        console.log('moving south');
    }

    moveWest() {
        console.log('moving west');
    }

    shortestPath() {
        let shortestPath = this.shortestPathWrapper();
        let curr = shortestPath.current;
        let maze = shortestPath.maze;

        while(curr.parent) {

            maze[curr.location.x][curr.location.y].isShortestPath = true;
            curr = maze[curr.parent.x][curr.parent.y];

            this.draw();
            this.maze = maze;
        }
    }

    shortestPathWrapper() {
        let maze = this.maze;
        let start = this.currCell;
        let end = this.endCell;

        let S = [];
        let Q = [];

        maze[start.location.x][start.location.y].parent = null;
        Q.push(this.startCell);

        while(Q.length > 0) {
            var current = Q.pop();

            if(current.location === end.location) {
                return {current, maze};
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
    renderCell(cell) {
        let fillColor;
        let w = this.canvas.width / this.maze.length; // 100 = 500 / 5
        let h = this.canvas.height / this.maze.length; // 100 = 500 / 5

        if(cell.location) {
            let x = cell.location.x;
            let y = cell.location.y;

            if(cell.isFinish) {
                fillColor = 'rgba(255, 0, 0, 0.5)';
            } else if (cell.isStart) {
                fillColor = 'rgba(0, 255, 0, 0.5)';
            } else {
                fillColor = '#FFF';
            }

            if (cell.isStart) {
                fillColor = 'rgba(0, 0, 255, 0.5)';
            }

            if(cell.isgScoreIsBest) {
                fillColor = 'rgba(255, 165, 0, 0.5)';
            }

            if(cell.isShortestPath) {
                fillColor = 'rgba(0, 255, 0, 0.5)';
            }

            this.context.fillStyle = fillColor;
            this.context.fillRect(x*w, y*h, w, h);

            _.each(cell.directions, (dir, index)=>{
                switch(index) {
                    case 'N':
                        this.context.beginPath();
                        this.context.moveTo(x*w, y*h);
                        this.context.lineTo((x+1)*w, y*h);
                        this.context.strokeStyle = (dir) ? '#FFF' : '#000';
                        this.context.stroke();
                        break;
                    case 'E':
                        this.context.beginPath();
                        this.context.moveTo((x+1)*w, y*h);
                        this.context.lineTo((x+1)*w, (y+1)*h);
                        this.context.strokeStyle = (dir) ? '#FFF' : '#000';
                        this.context.stroke();
                        break;
                    case 'S':
                        this.context.beginPath();
                        this.context.moveTo((x+1)*w, (y+1)*h);
                        this.context.lineTo(x*w, (y+1)*h);
                        this.context.strokeStyle = (dir) ? '#FFF' : '#000';
                        this.context.stroke();
                        break;
                    case 'W':
                        this.context.beginPath();
                        this.context.moveTo(x*w, (y+1)*h);
                        this.context.lineTo(x*w, y*h);
                        this.context.strokeStyle = (dir) ? '#FFF' : '#000';
                        this.context.stroke();
                        break;
                    default:
                }
            });
        }
    }

    draw() {
        this.context.save();

        for(let x in this.maze) {
            for(let y in this.maze[x]) {
                let cell = this.maze[x][y];
                this.renderCell(cell);
            }
        }

        this.context.restore();
    }
// ****** render functions end ******
}