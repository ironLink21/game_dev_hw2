'use strict';

class Player {
    constructor(spec) {
        this.currCell = spec.cell;
        this.center = {x:0, y:0};
        this.width = spec.width;
        this.height = spec.height;
        this.speed = spec.speed;
        this.moves = [];

        this.ready = false,
        this.image = new Image();

        this.image.onload=()=>{
            this.ready = true;
        };

        this.image.src = spec.imageSource;
    }

    update(elapsedTime, cell) {
        //spec.rotation += 0.01;
    }

    moveNorth(elapsedTime) {
        this.center.y -= (this.speed * (spec.elapsedTime / 1000));
    }

    moveEast(elapsedTime, speed) {
        this.center.x += (this.speed * (spec.elapsedTime / 1000));
    }

    moveSouth(elapsedTime, speed) {
        this.center.y += (this.speed * (spec.elapsedTime / 1000));
    }

    moveWest(elapsedTime, speed) {
        this.center.x -= (this.speed * (spec.elapsedTime / 1000));
    }

    draw(context) {
        if (this.ready) {
            context.save();

            context.translate(this.center.x, this.center.y);

            context.drawImage( this.image,
                               this.center.x - this.width / 2,
                               this.center.y - this.height / 2,
                               this.width, this.height );

            context.restore();
        }
    }
}