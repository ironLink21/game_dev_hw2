var MazeGame = (()=>{
    'use strict';

    const N = 'N';
    const S = 'S';
    const E = 'E';
    const W = 'W';
    const OPPOSITE = {N:S, S:N, E:W, W:E};

    var grid;
    var currCell;
    var context;
    var maze = [];
    var frontiers = [];

// ****** helper functions ******
    function randomProperty(obj) {
        let keys = Object.keys(obj);
        let dir = keys[ keys.length * Math.random() << 0];
        let cell = obj[dir];
        return {dir, cell};
    }
// ****** helper functions end ******

// ****** initializations ******
    function init(size = 5) {
        let canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        };

        initGrid(size);

        let x = Math.floor((Math.random() * grid.length-1) + 1);
        let y = Math.floor((Math.random() * grid.length-1) + 1);

        currCell = createCell({location:{x, y}});
        mark(currCell);
    }

    function initGrid(size) {
        grid = [];
        for(let i = 0; i < size; i++) {
            let cols = [];
            for(let j = 0; j < size; j++) {
                cols[j] = 0;
            }
            grid[i] = cols;
        }
    }
// ****** initializations end ******

// ****** maze functions ******
    function addFrontier(x, y) {
        let index = _.findIndex(frontiers, {x, y});
        if(x >= 0 && y >= 0 && y < grid.length && x < grid.length && index === -1 && grid[x][y] === 0) {
            frontiers.push({x, y});
        }
    }

    function findNeighbors(cell) {
        let x = cell.location.x;
        let y = cell.location.y;
        let neighbors = {};

        if(y > 0 && _.findIndex(maze, grid[x][y-1]) !== -1) {
            neighbors.N = {x, y:y-1};
        }

        if(x+1 < grid.length && _.findIndex(maze, grid[x+1][y]) !== -1) {
            neighbors.E = {x:x+1, y};
        }

        if(y+1 < grid.length && _.findIndex(maze, grid[x][y+1]) !== -1) {
            neighbors.S = {x, y:y+1};
        }

        if(x > 0 && _.findIndex(maze, grid[x-1][y]) !== -1) {
            neighbors.W = {x:x-1, y};
        }

        return neighbors;
    }

    function setStart() {
        let corners = [{x:0, y:0},{x:grid.length-1, y:0},{x:grid.length-1, y:grid.length-1},{x:0, y:grid.length-1}];
        let index = Math.floor(Math.random() * 4);
        let corner = corners[index];
        grid[corner.x][corner.y].isStart = true;
        grid[corner.x][corner.y].isCurrent = true;
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
// ****** maze functions end ******

// ****** create functions ******
    function createCell(specs) {
        let that = {};

        that.location = (specs.location) ? specs.location : console.log("missing location");
        that.directions = {N, E, S, W};
        that.isStart = false;
        that.isFinish = false;
        that.isCurrent = false;
        that.isVisited = false;
        that.isShortestPath = false;

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
            grid[nextCell.location.x][nextCell.location.y] = nextCell;
            grid[neighbor.cell.x][neighbor.cell.y].directions[dirOpp] = nextCell.location;

            currCell = nextCell;
        }
        let center = Math.floor(grid.length / 2);
        grid[center][center].isFinish = true;
        setStart();
    }

    function mark(cell) {
        let x = cell.location.x;
        let y = cell.location.y;

        grid[x][y] = cell;
        maze.push(cell);

        addFrontier(x-1, y);
        addFrontier(x+1, y);
        addFrontier(x, y-1);
        addFrontier(x, y+1);
    }
// ****** create functions end ******

// ****** render functions ******
    function renderCell(cell) {
        let fillColor;
        let w = canvas.width / grid.length; // 100 = 500 / 5
        let h = canvas.height / grid.length; // 100 = 500 / 5

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
                        context.strokeStyle = (dir != 'N') ? '#FFF' : '#000';
                        context.stroke();
                        break;
                    case 'E':
                        context.beginPath();
                        context.moveTo((x+1)*w, y*h);
                        context.lineTo((x+1)*w, (y+1)*h);
                        context.strokeStyle = (dir != 'E') ? '#FFF' : '#000';
                        context.stroke();
                        break;
                    case 'S':
                        context.beginPath();
                        context.moveTo((x+1)*w, (y+1)*h);
                        context.lineTo(x*w, (y+1)*h);
                        context.strokeStyle = (dir != 'S') ? '#FFF' : '#000';
                        context.stroke();
                        break;
                    case 'W':
                        context.beginPath();
                        context.moveTo(x*w, (y+1)*h);
                        context.lineTo(x*w, y*h);
                        context.strokeStyle = (dir != 'W') ? '#FFF' : '#000';
                        context.stroke();
                        break;
                    default:
                }
            });
        }
    }

    function draw() {
        context.save();

        for(let x = 0; x < grid.length; x++) {
            for(let y = 0; y < grid.length; y++) {
                let cell = grid[x][y];
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
        moveWest
    };
})();