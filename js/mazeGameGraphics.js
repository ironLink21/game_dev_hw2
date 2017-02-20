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

                } else if (isHintVisible && _.isEqual(hint.location, spec.location)) {
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

    function directionAction(type, spec) {
        let currCell = null;
        let score = null;

        let pathDir = _.map(spec.path ,(i)=>{
            return i.location;
        });

        let points = _.map(spec.path ,(i)=>{
            return i.point;
        });

        if(spec.cell.directions[type]){
            let location = spec.cell.location;
            spec.maze[location.x][location.y].isCurrent = false;
            spec.maze[spec.cell.directions[type].x][spec.cell.directions[type].y].isCurrent = true;
            spec.maze[spec.cell.directions[type].x][spec.cell.directions[type].y].isVisited = true;
            spec.maze[spec.cell.directions[type].x][spec.cell.directions[type].y].count++;
            currCell = spec.maze[spec.cell.directions[type].x][spec.cell.directions[type].y];

            if(_.isEqual(spec.cell.directions[type], _.last(pathDir))) {
                let element = spec.path.pop();
                spec.maze[location.x][location.y].isShortestPath = false;
                score = element.point;
            } else {
                let point = (_.last(points) === -1 || _.last(points) === -2) ? -2 : -1;
                spec.path.push({point, location});
                spec.maze[location.x][location.y].isShortestPath = true;
                score = point;
            }
        }

        return {maze: spec.maze, currCell, path: spec.path, score};
    }

    function Player() {
        var that = {};

        that.moveNorth=(spec)=>{
            return directionAction('N', spec);
        };

        that.moveEast=(spec)=>{
            return directionAction('E', spec);
        };

        that.moveSouth=(spec)=>{
            return directionAction('S', spec);
        };

        that.moveWest=(spec)=>{
            return directionAction('W', spec);
        };

        return that;
    }

    function beginRender() {
        context.clear();
    }

    function togglePath() {
        isShortVisible = (isShortVisible) ? false : true;
    }

    function toggleHint(spec) {
        isHintVisible = (isHintVisible) ? false : true;
        hint = _.last(spec.path);
    }

    function toggleBreadcrumbs() {
        isBreadVisible = (isBreadVisible) ? false : true;
    }

    return {
        initialize,
        context,
        Player,
        Cell,
        beginRender,
        togglePath,
        toggleHint,
        toggleBreadcrumbs
    };
})();