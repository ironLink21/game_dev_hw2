let Graphics = (()=>{
    'use strict';

    let canvas = null;
    let context = null;
    let mySize = null;
    let isShortVisible = false;
    let isHintVisible = false;
    let isBreadVisible = false;
    let hint = {};
    let colors = {
        wall: 'rgba(0, 128, 0, 1)',
        floor: 'rgba(44, 176, 55, 1)',
        path: '#4169E1'
    };

    function initialize(size = 0) {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        mySize = size;

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        };
    }

    function Cell(spec) {
        let that = {};

        that.draw=()=>{
			context.save();

            let fillColor;
            let w = canvas.width / mySize; // 100 = 500 / 5
            let h = canvas.height / mySize; // 100 = 500 / 5
            let x = spec.location.x;
            let y = spec.location.y;

            if(spec.isFinish) {
                fillColor = 'rgba(255, 0, 0, 0.5)';

            } else if (spec.isStart) {
                fillColor = 'rgba(0, 255, 0, 0.5)';

            } else {
                if(isShortVisible && spec.isShortestPath) {
                    fillColor = colors.path;

                } else if (isHintVisible && _.isEqual(hint, spec.location)) {
                    fillColor = 'rgba(238, 36, 188, 0.5)';

                } else if (isBreadVisible && spec.isVisited) {
                    fillColor = 'rgba(230, 247, 48, 0.5)';

                } else {
                    fillColor = colors.floor;
                }
            }

            if(spec.isCurrent) {
                fillColor = 'rgba(255, 165, 0, 0.5)';
            }

            context.fillStyle = fillColor;
            context.fillRect(x*w, y*h, w, h);

            _.each(spec.directions, (dir, index)=>{
                context.beginPath();

                switch(index) {
                    case 'N':
                        context.moveTo(x*w, y*h);
                        context.lineTo((x+1)*w, y*h);
                        context.strokeStyle = (dir) ? colors.floor : colors.wall;
                        break;

                    case 'E':
                        context.moveTo((x+1)*w, y*h);
                        context.lineTo((x+1)*w, (y+1)*h);
                        context.strokeStyle = (dir) ? colors.floor : colors.wall;
                        break;

                    case 'S':
                        context.moveTo((x+1)*w, (y+1)*h);
                        context.lineTo(x*w, (y+1)*h);
                        context.strokeStyle = (dir) ? colors.floor : colors.wall;
                        break;

                    case 'W':
                        context.moveTo(x*w, (y+1)*h);
                        context.lineTo(x*w, y*h);
                        context.strokeStyle = (dir) ? colors.floor : colors.wall;
                        break;
                    default:
                }

                context.lineWidth = 3;
                context.stroke();
            });

			context.restore();
		};

        return that;
    }

    function directionAction(type, elapsedTime, maze, cell, path) {
        let currCell = null;
        let score = null;

        let pathDir = _.map(path ,(i)=>{
            return i.location;
        });

        let points = _.map(path ,(i)=>{
            return i.point;
        });

        if(cell.directions[type]){
            let location = cell.location;
            maze[location.x][location.y].isCurrent = false;
            maze[cell.directions[type].x][cell.directions[type].y].isCurrent = true;
            maze[cell.directions[type].x][cell.directions[type].y].isVisited = true;
            maze[cell.directions[type].x][cell.directions[type].y].count++;
            currCell = maze[cell.directions[type].x][cell.directions[type].y];

            if(_.isEqual(cell.directions[type], _.last(pathDir))) {
                let element = path.pop();
                maze[location.x][location.y].isShortestPath = false;
                score = element.point;
            } else {
                let point = (_.last(points) === -1 || _.last(points) === -2) ? -2 : -1;
                path.push({point, location});
                maze[location.x][location.y].isShortestPath = true;
                score = point;
            }
        }
        // spec.center.x -= (spec.speed * (elapsedTime / 1000));
        return {maze, currCell, path, score};
    }

    function Texture(spec) {
        var that = {};
            // ready = false,
            // image = new Image();

        // image.onload =()=>{
        //     ready = true;
        // };

        // image.src = spec.imageSource;

        that.update=()=>{
            //spec.rotation += 0.01;
        };

        that.moveNorth=(elapsedTime, maze, cell, path)=>{
            return directionAction('N', elapsedTime, maze, cell, path);
            // spec.center.x -= (spec.speed * (elapsedTime / 1000));
        };

        that.moveEast=(elapsedTime, maze, cell, path)=>{
            return directionAction('E', elapsedTime, maze, cell, path);
            // spec.center.x -= (spec.speed * (elapsedTime / 1000));
        };

        that.moveSouth=(elapsedTime, maze, cell, path)=>{
            return directionAction('S', elapsedTime, maze, cell, path);
            // spec.rotation -= (spec.rotateRate * (elapsedTime / 1000));
        };

        that.moveWest=(elapsedTime, maze, cell, path)=>{
            return directionAction('W', elapsedTime, maze, cell, path);
            // spec.rotation -= (spec.rotateRate * (elapsedTime / 1000));
        };

        return that;
    }

    function beginRender() {
        context.clear();
    }

    function togglePath(elapsedTime) {
        isShortVisible = (isShortVisible) ? false : true;
    }

    function toggleHint(elapsedTime, maze = null, currCell = null, path) {
        isHintVisible = (isHintVisible) ? false : true;
        hint = _.last(path);
    }

    function toggleBreadcrumbs(elapsedTime) {
        isBreadVisible = (isBreadVisible) ? false : true;
    }

    return {
        initialize,
        Cell,
        Texture,
        beginRender,
        togglePath,
        toggleHint,
        toggleBreadcrumbs
    };
})();