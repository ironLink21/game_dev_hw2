let Player = (()=>{
    'use strict';

    function player(spec) {
        let that = {};

        let width = spec.width;
        let height = spec.height;
        let speed = spec.speed;
        let context = spec.context;

        let center = {x:(spec.cell.location.x*width)/2, y:(spec.cell.location.y*height)/2};
        let moves = [];

        let ready = false;
        let image = new Image();

        image.onload=()=>{
            ready = true;
        };

        image.src = spec.imageSource;

        that.move=(spec)=>{
            center = {x:(spec.cell.location.x*width)/2, y:(spec.cell.location.y*height)/2};

            switch(spec.type) {
                case 'N':
                    center.y -= (speed * (spec.elapsedTime / 1000));
                    break;
                case 'E':
                    center.x += (speed * (spec.elapsedTime / 1000));
                    break;
                case 'S':
                    center.y += (speed * (spec.elapsedTime / 1000));
                    break;
                case 'W':
                    center.x -= (speed * (spec.elapsedTime / 1000));
                    break;
                default:
            }

        };

        that.draw=()=>{
            if (ready) {
                context.save();

                context.translate(center.x, center.y);

                context.drawImage(
                    image,
                    center.x,
                    center.y,
                    width, height
                );

                context.restore();
            }
        };

        return that;
    }

    return {
        player
    };
})();