var MazeGame=(()=>{
    'use strict';

    const OPPOSITE = {N:'S', S:'N', E:'W', W:'E'};

    var maze;
    var currCell;
    var startCell;
    var endCell;
    var canvas;
    var context;
    var inMaze = [];
    var frontiers = [];

// ****** helper functions ******
    function randomProperty(obj) {
        let keys = Object.keys(obj);
        let dir = keys[ keys.length * Math.random() << 0];
        let cell = obj[dir];
        return {dir, cell};
    }

    function heuristic(pos0, pos1) {
		// This is the Manhattan distance
		var d1 = Math.abs(pos1.x - pos0.x);
		var d2 = Math.abs(pos1.y - pos0.y);
		return d1 + d2;
	}
// ****** helper functions end ******

// ****** initializations ******
    function init(size = 5) {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        };

        maze = [];
        for(let i = 0; i < size; i++) {
            let cols = [];
            for(let j = 0; j < size; j++) {
                cols[j] = 0;
            }
            maze[i] = cols;
        }

        let x = Math.floor((Math.random() * maze.length-1) + 1);
        let y = Math.floor((Math.random() * maze.length-1) + 1);

        currCell = createCell({location:{x, y}});
        mark(currCell);
    }
// ****** initializations end ******

// ****** maze functions ******
    function addFrontier(x, y) {
        let index = _.findIndex(frontiers, {x, y});
        if(x >= 0 && y >= 0 && y < maze.length && x < maze.length && index === -1 && maze[x][y] === 0) {
            frontiers.push({x, y});
        }
    }

    function findNeighbors(cell) {
        let x = cell.location.x;
        let y = cell.location.y;
        let neighbors = {};

        if(y > 0 && _.findIndex(inMaze, maze[x][y-1]) !== -1) {
            neighbors.N = {x, y:y-1};
        }

        if(x+1 < maze.length && _.findIndex(inMaze, maze[x+1][y]) !== -1) {
            neighbors.E = {x:x+1, y};
        }

        if(y+1 < maze.length && _.findIndex(inMaze, maze[x][y+1]) !== -1) {
            neighbors.S = {x, y:y+1};
        }

        if(x > 0 && _.findIndex(inMaze, maze[x-1][y]) !== -1) {
            neighbors.W = {x:x-1, y};
        }

        return neighbors;
    }

    function setStartEnd() {
        let cornerStart = [{x:0, y:0},{x:maze.length-1, y:0},{x:maze.length-1, y:maze.length-1},{x:0, y:maze.length-1}];
        let cornerEnd = [{x:maze.length-1, y:maze.length-1},{x:0, y:maze.length-1},{x:0, y:0},{x:maze.length-1, y:0}];
        let index = Math.floor(Math.random() * 4);

        let start = cornerStart[index];
        let end = cornerEnd[index];

        maze[start.x][start.y].isStart = true;
        maze[start.x][start.y].isCurrent = true;
        startCell = maze[start.x][start.y];

        maze[end.x][end.y].isFinish = true;
        endCell = maze[end.x][end.y];
    }

    function moveNorth() {
        console.log('moving north');
    }

    function moveEast() {
        console.log('moving east');
    }

    function moveSouth() {
        console.log('moving south');
    }

    function moveWest() {
        console.log('moving west');
    }

    function shortestPath() {
        let maze = this.maze;
        for(let i in this.maze) {
            for(let j in this.maze) {
                maze[i][j].isShortestPath = false;
                maze[i][j].isgScoreIsBest = false;
            }
        }
        this.maze = maze;

        let shortestPath = findShortestPath(startCell, endCell);
        console.log(shortestPath);
    }

    function findShortestPath(start, end) {
        let closedList = [];
        let openList = [];
        let maze = this.maze;
        openList.push(start);

        while(openList.length > 0) {

            let lowInd = 0;
            for(let i in openList) {
                if(openList[i].fScore < openList[lowInd].fScore) {
                    lowInd = i;
                }
            }

            let currentNode = openList[lowInd];

            // End case -- result has been found
            if(currentNode.location == end.location) {
                let curr = this.startCell;
                let ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    maze[curr.location.x][curr.location.y].isShortestPath = true;
                    curr = maze[curr.parent.x][curr.parent.y];

                    this.maze = maze;
                    this.draw();
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode
            openList = _.reject(openList, (obj)=>{ return _.isEqual(obj, currentNode); });

            closedList.push(currentNode);
            let neighbors = currentNode.directions; // {N: false, E:{}, S:false, W:{}}

            _.each(neighbors, (nbr)=>{
                if(nbr && _.indexOf(closedList, this.maze[nbr.x][nbr.y])) {
                    let gScore = currentNode.gScore + 1;
                    let gScoreIsBest = false;

                    if(_.indexOf(openList, maze[nbr.x][nbr.y]) === -1) {
                        gScoreIsBest = true;

                        maze[nbr.x][nbr.y].huristic = this.heuristic(nbr, end.location);
                        openList.push(maze[nbr.x][nbr.y]);

                    } else if (gScore < maze[nbr.x][nbr.y].gScore) {
                        gScoreIsBest = true;
                    }

                    if(gScoreIsBest) {
                        let obj = maze[nbr.x][nbr.y];
                        obj.parent = currentNode.location;
                        obj.isgScoreIsBest = true;
                        obj.gScore = gScore;
                        obj.fScore = obj.gScore + obj.huristic;
                        maze[nbr.x][nbr.y] = obj;
                    }
                }
            });

            this.maze = maze;
            this.draw();
        }

        this.maze = maze;
        return [];
    }
// ****** maze functions end ******

// ****** create functions ******
    function createCell(specs) {
        let that = {};

        that.location = (specs.location) ? specs.location : console.log("missing location");
        that.directions = {N: false, E: false, S: false, W: false};
        that.isStart = false;
        that.isFinish = false;
        that.isCurrent = false;
        that.isVisited = false;
        that.isShortestPath = false;
        that.fScore = 0;
        that.gScore = 0;
        that.huristic = 0;
        that.parent = null;

        return that;
    }

    function CreateMaze(size = 5) {
        init(size);
        while(frontiers.length > 0) {
            let nextCell = frontiers.splice(Math.floor(Math.random() * frontiers.length), 1)[0]; // find next sell from frontier cells
            nextCell = createCell({location:nextCell});
            mark(nextCell); // add cell to maze, move to cell

            let neighbor = randomProperty(findNeighbors(nextCell));

            let dir = neighbor.dir;
            let dirOpp = OPPOSITE[dir];

            nextCell.directions[dir] = neighbor.cell;
            maze[nextCell.location.x][nextCell.location.y] = nextCell;
            maze[neighbor.cell.x][neighbor.cell.y].directions[dirOpp] = nextCell.location;

            currCell = nextCell;
        }

        setStartEnd();
    }

    function mark(cell) {
        let x = cell.location.x;
        let y = cell.location.y;

        maze[x][y] = cell;
        inMaze.push(cell);

        addFrontier(x-1, y);
        addFrontier(x+1, y);
        addFrontier(x, y-1);
        addFrontier(x, y+1);
    }
// ****** create functions end ******

// ****** render functions ******
    function renderCell(cell) {
        let fillColor;
        let w = canvas.width / maze.length; // 100 = 500 / 5
        let h = canvas.height / maze.length; // 100 = 500 / 5

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

            context.fillStyle = fillColor;
            context.fillRect(x*w, y*h, w, h);

            _.each(cell.directions, (dir, index)=>{
                switch(index) {
                    case 'N':
                        context.beginPath();
                        context.moveTo(x*w, y*h);
                        context.lineTo((x+1)*w, y*h);
                        context.strokeStyle = (dir) ? '#FFF' : '#000';
                        context.stroke();
                        break;
                    case 'E':
                        context.beginPath();
                        context.moveTo((x+1)*w, y*h);
                        context.lineTo((x+1)*w, (y+1)*h);
                        context.strokeStyle = (dir) ? '#FFF' : '#000';
                        context.stroke();
                        break;
                    case 'S':
                        context.beginPath();
                        context.moveTo((x+1)*w, (y+1)*h);
                        context.lineTo(x*w, (y+1)*h);
                        context.strokeStyle = (dir) ? '#FFF' : '#000';
                        context.stroke();
                        break;
                    case 'W':
                        context.beginPath();
                        context.moveTo(x*w, (y+1)*h);
                        context.lineTo(x*w, y*h);
                        context.strokeStyle = (dir) ? '#FFF' : '#000';
                        context.stroke();
                        break;
                    default:
                }
            });
        }
    }

    function draw() {
        context.save();

        for(let x in maze) {
            for(let y in maze[x]) {
                let cell = maze[x][y];
                renderCell(cell);
            }
        }

        context.restore();
    }
// ****** render functions end ******

    return {
        CreateMaze,
        draw,
        moveNorth,
        moveEast,
        moveSouth,
        moveWest,
        shortestPath
    };
})();