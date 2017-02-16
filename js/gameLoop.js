let GameLoop = (()=>{
    'use strict';

    let prevTime = 0;
    let game;
    let elapsedTime;

    function update(elapsedTime) {

    }

    function render(elapsedTime) {
        Graphics.beginRender();
        game.drawMaze();
    }

    function gameLoop(time) {
        elapsedTime = time - prevTime;
        prevTime = time;


        update(elapsedTime);
        render(elapsedTime);

        window.requestAnimationFrame(gameLoop);
    }

    window.onload=()=>{
        game = new MazeGame(5);
        // game.shortestPathWrapper();

        window.requestAnimationFrame(gameLoop);

        window.addEventListener('keydown', (e)=>{
            game.keyDown(e, elapsedTime);
        });
    };
})();