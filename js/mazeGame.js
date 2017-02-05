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
    var frontiers = [];

    function createGrid(size) {
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
        that.neighbors = (specs.neighbors) ? specs.neighbors : {};

        return that;
    }

    function mark(cell) {
        // mark cell as in maze
        let x = cell.location.x;
        let y = cell.location.y;
        grid[x][y] = cell;

        // add surrounding cells as frontiers
        addFrontier(x-1, y);
        addFrontier(x+1, y);
        addFrontier(x, y-1);
        addFrontier(x, y+1);
    }

    function addFrontier(x, y) {
        if(x >= 0 && y >= 0 && y < grid.length && x < grid.length && grid[x][y] === 0) {
            let index = _.findIndex(frontiers,{x, y});
            if(index === -1) {
                grid[x][y] = 'F';
                frontiers.push({x, y});
            }
        }
    }

    function findNeighbors(cell) {
        let x = cell.x;
        let y = cell.y;
        let neighbors = [];

        if(x > 0 && grid[x-1][y] !== 0 && grid[x-1][y] !== 'F') {
            neighbors.push({x:x-1, y});
        }

        if(x+1 < grid.length && grid[x+1][y] !== 0 && grid[x+1][y] !== 'F') {
            neighbors.push({x:x+1, y});
        }

        if(y > 0 && grid[x][y-1] !== 0 && grid[x][y-1] !== 'F') {
            neighbors.push({x, y:y-1});
        }

        if(y+1 < grid.length && grid[x][y+1] !== 0 && grid[x][y+1] !== 'F') {
            neighbors.push({x, y:y+1});
        }

        return neighbors;
    }

    function direction(cell1, cell2) {
        let x = cell1.x;
        let y = cell1.y;
        let nx = cell2.x;
        let ny = cell2.y;

        if(y < ny) return N;
        if(y > ny) return S;
        if(x > nx) return E;
        if(x < nx) return W;
    }

    function renderCell(cell) {
        let w = canvas.width / grid.length; // 100 = 500 / 5
        let h = canvas.height / grid.length; // 100 = 500 / 5

        if(cell.location) {
            let x = cell.location.x;
            let y = cell.location.y;

            if(!cell.neighbors.N) {
                context.beginPath();
                context.moveTo(x*w, y*h);
                context.lineTo((x+1)*w, y*h);
                context.stroke();
            }

            if(!cell.neighbors.E) {
                context.beginPath();
                context.moveTo((x+1)*w, y*h);
                context.lineTo((x+1)*w, (y+1)*h);
                context.stroke();
            }

            if(!cell.neighbors.S) {
                context.beginPath();
                context.moveTo((x+1)*w, (y+1)*h);
                context.lineTo(x*w, (y+1)*h);
                context.stroke();
            }

            if(!cell.neighbors.W) {
                context.beginPath();
                context.moveTo(x*w, (y+1)*h);
                context.lineTo(x*w, y*h);
                context.stroke();
            }

            context.fillStyle = '#FFF';
            context.fillRect(x*w, y*h, w, h);
        } else if (cell.type == 'F') {
            context.fillStyle = cell.fill;
            context.fillRect(cell.x*w, cell.y*h, w, h);
            context.strokeStyle = '#000';
            context.strokeRect(cell.x*w, cell.y*h, w, h);

        } else {
            context.fillStyle = cell.fill;
            context.fillRect(cell.x*w, cell.y*h, w, h);
            context.strokeStyle = '#000';
            context.strokeRect(cell.x*w, cell.y*h, w, h);
        }
    }

    function render() {
        context.save();

        for(let x = 0; x < grid.length; x++) {
            for(let y = 0; y < grid.length; y++) {
                let cell = grid[x][y];

                if(cell === 0 || cell === 'F') {
                    cell = (cell === 0) ? {type:cell, x, y, fill: 'rgba(128, 128, 128, 0.5)'} :{type:cell, x, y, fill: 'rgba(255, 0, 0, 0.5)'};
                    renderCell(cell);
                } else {
                    renderCell(cell);
                }
            }
        }

        context.restore();
    }

    function createMaze(size = 5) {
        createGrid(size);

        let x = Math.floor((Math.random() * grid.length-1) + 1);
        let y = Math.floor((Math.random() * grid.length-1) + 1);

        currCell = createCell({location:{x, y}});
        mark(currCell);

        while(frontiers.length > 0) {
            let frontier = frontiers.splice(Math.floor(Math.random() * frontiers.length), 1);
            frontier = frontier[0];
            let n = findNeighbors(frontier);
            let neighbor = n.splice(Math.floor(Math.random() * n.length), 1);
            neighbor = neighbor[0];

            let dir = direction(frontier, neighbor);
            let dirOpp = OPPOSITE[dir];

            let nextCell = createCell({location:frontier, neighbors:{[dirOpp]:neighbor}});
            grid[nextCell.location.x][nextCell.location.y] = nextCell;

            grid[currCell.location.x][currCell.location.y].neighbors[dir] = nextCell.location;

            currCell = nextCell;

            mark(nextCell);
            render();
        }
    }

    window.onload=()=>{
        let canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        };

        createMaze(5);
    };
})();