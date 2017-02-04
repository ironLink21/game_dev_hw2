var MazeGame = (()=>{
    'use strict';

    var grid;
    var frontiers = [];
    var currCell;

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
        that.neighbors = (specs.neighbors) ? specs.neighbors : [];

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
        if(x >= 0 && y >= 0 && y < grid.length && x < grid[y].length && grid[x][y] === 0) {
            frontiers.push({x,y});
        }
    }

    function createMaze(size = 5) {
        createGrid(size);

        let x = Math.floor((Math.random() * size) + 1);
        let y = Math.floor((Math.random() * size) + 1);

        currCell = createCell({location:{x, y}});
        mark(currCell);

        while(frontiers.length > 0) {
            let frontier = Math.floor(Math.random() * frontiers.length);
            let nextMove = frontiers.splice(frontier, 1);
            let nextCell = createCell({location:nextMove});

            currCell.neighbors.push(nextCell);
            nextCell.neighbors.push(currCell);

            mark(nextCell);
        }
    }

    window.onload=()=>{
        createMaze(5);
    };
})();