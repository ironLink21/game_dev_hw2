let GameLoop = (()=>{
    'use strict';

    let prevTime = 0;
    let game;
    let player;
    let elapsedTime;
    let scoreElement;
    let timerElement;
    let scoreSection;
    let scores = [];

    function update(elapsedTime) {
        if(_.size(game.maze) > 0) {
            game.startGame(scoreSection);
            game.updateTime(timerElement);
            scoreElement.innerHTML = "Score: " + game.getScore();
            let output = game.endGame(game, scores, scoreSection);

            game = (output.game) ? output.game : game;
            scores = (output.scores) ? output.scores : scores;
            // player.update(elapsedTime, game.currCell.location);
        }
    }

    function render(elapsedTime) {
        Graphics.beginRender();
        if(_.size(game.maze) > 0) {
            game.drawMaze();
        }
    }

    function gameLoop(time) {
        elapsedTime = time - prevTime;
        prevTime = time;


        update(elapsedTime);
        render(elapsedTime);

        window.requestAnimationFrame(gameLoop);
    }

    function toggleMazeSize(size) {
        game = new MazeGame(size);
        // player = new Player({cell: game.startCell.location, imageSource: '../assets/navi.png'});
    }

    function toggleAccordion() {
        let accordion = document.getElementsByClassName("accordion");

        _.each(accordion, (acc)=>{
            acc.onclick = ()=>{
                acc.classList.toggle("active");
                let panel = acc.nextElementSibling;
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                    panel.style.display = 'none';
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                    panel.style.display = 'inline-block';
                }
            };
        });
    }

    window.onload=()=>{
        Graphics.initialize();
        toggleAccordion();
        game = new MazeGame(null);

        scoreElement = document.getElementById("score");
        timerElement = document.getElementById("timer");
        scoreSection = document.getElementById("score-section");

        game.toggleScores({scores, scoreSection});

        window.addEventListener('keydown', (e)=>{ game.keyDown(e, elapsedTime, scores, scoreSection); });
        window.requestAnimationFrame(gameLoop);
    };

    return {
        toggleMazeSize
    };
})();