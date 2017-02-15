var GameLoop = (()=>{
    'use strict';

    var prevTime = 0;
    var events = [];
    var game;

    function gameLoop(time) {
        let elapsedTime = time - prevTime;
        prevTime = time;

        update(elapsedTime);
        render();

        window.requestAnimationFrame(gameLoop);
    }

    function update(elapsedTime) {
        events = _.map(events, (event)=>{
            event.time += elapsedTime;

            if(event.time >= event.interval && (event.repeat-1) > -1) {
                event.repeat -= 1;
                event.time -= event.interval;
                event.isUpdate = true;
                return event;

            } else if ((event.repeat-1) > -1) {
                event.isUpdate = false;
                return event;
            }
        });
        events = _.reject(events, (event)=>{ return event === undefined; });
    }

    function render() {
        _.each(events,(event)=>{
            if(event.isUpdate) {
                let node = document.getElementById('output-section');
                node.innerHTML += "Event: " + event.eventName + "(" + event.repeat + " remaining)\n";
                node.scrollTop = node.scrollHeight;
            }
        });

        game.draw();
    }

    function addEvent(){
        events.push({eventName, interval, repeat, time: 0});
    }

    window.onload=()=>{
        window.requestAnimationFrame(gameLoop);
        game = new MazeGame(5);
        // game.shortestPath();
    };

    return {
        addEvent
    };
})();