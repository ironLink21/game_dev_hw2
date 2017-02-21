'use strict';

class MazeGame {
    constructor(size) {
        this.OPPOSITE = {N:'S', S:'N', E:'W', W:'E'};
        this.startCell = null;
        this.endCell = null;
        this.inMaze = [];
        this.frontiers = [];
        this.path = [];
        this.playerMoves = [];
        this.score = 0;
        this.size = size;
        this.startTime = 0;
        this.endTime = 0;
        this.timeObj = {minutes:0, seconds: 0};
        this.startClick = false;

        this.maze = this.initMaze(size);

        let x = Math.floor((Math.random() * this.maze.length-1) + 1);
        let y = Math.floor((Math.random() * this.maze.length-1) + 1);

        this.currCell = this.createCell({location:{x, y}});
        if(_.size(this.maze) > 0) {
            this.mark(this.currCell);
            this.createMaze();
            this.shortestPath();

            Graphics.init({size, cell:this.currCell, finished:this.endCell});
        }

        this.myPlayer = Graphics.PlayerObj();

        this.inputDispatch = {
            [72]: Graphics.toggleHint, // H
            [66]: Graphics.toggleBreadcrumbs, // B
            [80]: Graphics.togglePath, // P
            [89]: this.toggleScores, // Y

            [87]: this.myPlayer.moveNorth, // w
            [68]: this.myPlayer.moveEast, // d
            [83]: this.myPlayer.moveSouth, // s
            [65]: this.myPlayer.moveWest, // a

            [73]: this.myPlayer.moveNorth, // i
            [76]: this.myPlayer.moveEast, // l
            [75]: this.myPlayer.moveSouth, // k
            [74]: this.myPlayer.moveWest, // j

            [38]: this.myPlayer.moveNorth, // ^
            [39]: this.myPlayer.moveEast, // >
            [40]: this.myPlayer.moveSouth, // <
            [37]: this.myPlayer.moveWest, // V
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

    keyDown(e, elapsedTime, scores, scoreSection) {
        // console.log(e.key, e.keyCode);
        if (this.inputDispatch.hasOwnProperty(e.keyCode)) {
            let input = null;
            input = this.inputDispatch[e.keyCode]({elapsedTime, maze:this.maze, cell:this.currCell, path:this.path, scores, scoreSection});

            if(input) {
                this.maze = input.maze;
                this.currCell = (input.currCell) ? input.currCell : this.currCell;
                this.path = input.path;
                if(this.currCell.count <= 1) {
                    this.score += input.score;
                }
            }
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
            }

            _.each(current.directions, (val)=>{
                if(val) {
                    if(_.indexOf(S, val) === -1 && !_.isEqual(val, current.parent)) {
                        S.push(val);
                        maze[val.x][val.y].parent = current.location;
                        Q.push(maze[val.x][val.y]);
                    }
                }
            });
        }

        current = maze[current.location.x][current.location.y];

        while(!current.isStart) {
            let parent = maze[current.location.x][current.location.y].parent;
            maze[current.location.x][current.location.y].isShortestPath = true;

            this.path.push({point:5, location: current.location});

            current = maze[parent.x][parent.y];
        }

        this.maze = maze;
    }

    updateTime(element) {
        let time = new Date();

        if(this.startClick) {
            let minutes = time.getMinutes() - this.startTime.getMinutes();
            let seconds = time.getSeconds();
            this.timeObj = {minutes, seconds};
            element.innerHTML = "Timer: " + minutes + ":" + seconds;
        }
    }

    startGame(scoreSection) {
        this.startClick = true;
        this.startTime = new Date();
        scoreSection.style.display = 'none';
    }

    endGame(game, scores, scoreSection) {
        if(_.isEqual(this.currCell, this.endCell)) {
            this.startClick = false;

            let time = this.timeObj.minutes + ":" + this.timeObj.seconds;
            let score = this.score;

            scores.push({score:score, time});

            this.toggleScores({scores, scoreSection});

            this.currCell = {};
            this.score = 0;
            this.endTime = 0;
            this.startTime = 0;
            return {game:null, scores};
        }

        return {game};
    }

    getScore() {
        return this.score;
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
        that.count = 0;

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

    drawPlayer() {
        this.myPlayer.draw();
    }

    togglePath() {
        this.isShortVisible = (this.isShortVisible) ? false : true;
    }
// ****** render functions end ******

// ****** interface functions ******
    toggleScores(spec) {
        if(spec.scores.length <= 0) {
            spec.scoreSection.innerHTML = "<div id='start-game'>Pick a maze size to start</div>";
            spec.scoreSection.style.display = 'block';
        } else {
            spec.scoreSection.innerHTML = "";
            spec.scores = _.sortBy(spec.scores, 'score');

            _.each(spec.scores, (score, i)=>{
                ++i;
                spec.scoreSection.innerHTML += "<span class='score-card'>" + i + ". &nbsp;&nbsp;<div>Time: " + score.time + "</div>&nbsp;&nbsp;<div>Score: " + score.score + "</div></span><br>";
            });
            spec.scoreSection.style.display = 'block';
            this.maze = null;
        }
    }
// ****** interface functions end ******
}