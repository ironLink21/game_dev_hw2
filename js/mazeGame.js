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

    function createCell(specs) {
        let that = {};

        that.location = (specs.location) ? specs.location : console.log("missing location");
        that.directions = {N, E, S, W};
        that.isStart = false;
        that.isFinish = false;
        that.isVisited = false;
        that.isShortestPath = false;

        return that;
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

    function addFrontier(x, y) {
        let index = _.findIndex(frontiers, {x, y});
        if(x >= 0 && y >= 0 && y < grid.length && x < grid.length && index === -1 && grid[x][y] === 0) {
            frontiers.push({x, y});
        }
    }

    function randomProperty(obj) {
        let keys = Object.keys(obj);
        let dir = keys[ keys.length * Math.random() << 0];
        let cell = obj[dir];
        return {dir, cell};
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

    function renderCell(cell) {
        let w = canvas.width / grid.length; // 100 = 500 / 5
        let h = canvas.height / grid.length; // 100 = 500 / 5

        if(cell.location) {
            let x = cell.location.x;
            let y = cell.location.y;

            context.fillStyle = '#FFF';
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

    function createMaze() {
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
        draw();
    }

    window.onload=()=>{
        init(15);
        createMaze();
    };
})();