let Graphics = (()=>{
    'use strict';

    let canvas = null;
    let context = null;
    let mySize = null;
    let isShortVisible = false;

    function initialize(size) {
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
                    fillColor = 'rgba(0, 0, 255, 0.5)';
                } else {
                    fillColor = '#FFF';
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
                        context.strokeStyle = (dir) ? '#FFF' : '#000';
                        break;

                    case 'E':
                        context.moveTo((x+1)*w, y*h);
                        context.lineTo((x+1)*w, (y+1)*h);
                        context.strokeStyle = (dir) ? '#FFF' : '#000';
                        break;

                    case 'S':
                        context.moveTo((x+1)*w, (y+1)*h);
                        context.lineTo(x*w, (y+1)*h);
                        context.strokeStyle = (dir) ? '#FFF' : '#000';
                        break;

                    case 'W':
                        context.moveTo(x*w, (y+1)*h);
                        context.lineTo(x*w, y*h);
                        context.strokeStyle = (dir) ? '#FFF' : '#000';
                        break;
                    default:
                }

                context.stroke();
            });

			context.restore();
		};

        return that;
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

        that.moveNorth=(elapsedTime, maze, cell)=>{
            console.log('moving north');
            let currCell = null;

            if(cell.directions.N){
                maze[cell.location.x][cell.location.y].isCurrent = false;
                maze[cell.directions.N.x][cell.directions.N.y].isCurrent = true;
                currCell = maze[cell.directions.N.x][cell.directions.N.y];
            }
            // spec.center.x -= (spec.speed * (elapsedTime / 1000));
            return {maze, currCell};
        };

        that.moveEast=(elapsedTime, maze, cell)=>{
            console.log('moving east');
            let currCell = null;

            if(cell.directions.E){
                maze[cell.location.x][cell.location.y].isCurrent = false;
                maze[cell.directions.E.x][cell.directions.E.y].isCurrent = true;
                currCell = maze[cell.directions.E.x][cell.directions.E.y];
            }
            // spec.center.x -= (spec.speed * (elapsedTime / 1000));
            return {maze, currCell};
        };

        that.moveSouth=(elapsedTime, maze, cell)=>{
            console.log('moving south');
            let currCell = null;

            if(cell.directions.S){
                maze[cell.location.x][cell.location.y].isCurrent = false;
                maze[cell.directions.S.x][cell.directions.S.y].isCurrent = true;
                currCell = maze[cell.directions.S.x][cell.directions.S.y];
            }
            // spec.rotation -= (spec.rotateRate * (elapsedTime / 1000));
            return {maze, currCell};
        };

        that.moveWest=(elapsedTime, maze, cell)=>{
            console.log('moving west');
            let currCell = null;

            if(cell.directions.W){
                maze[cell.location.x][cell.location.y].isCurrent = false;
                maze[cell.directions.W.x][cell.directions.W.y].isCurrent = true;
                currCell = maze[cell.directions.W.x][cell.directions.W.y];
            }
            // spec.rotation -= (spec.rotateRate * (elapsedTime / 1000));
            return {maze, currCell};
        };

        that.draw=()=>{
            console.log('draw Texture');
            // if (ready) {
            //     context.save();

            //     context.translate(spec.center.x, spec.center.y);
            //     context.rotate(spec.rotation);
            //     context.translate(-spec.center.x, -spec.center.y);

            //     context.drawImage(
            //         image,
            //         spec.center.x - spec.width / 2,
            //         spec.center.y - spec.height / 2,
            //         spec.width, spec.height);

            //     context.restore();
            // }
        };

        return that;
    }

    function beginRender() {
        context.clear();
    }

    function togglePath(elapsedTime) {
        console.log('toggle path');
        isShortVisible = (isShortVisible) ? false : true;
    }

    return {
        initialize,
        Cell,
        Texture,
        beginRender,
        togglePath
    };
})();