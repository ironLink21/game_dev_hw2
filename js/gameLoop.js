let GameLoop = (()=>{
    'use strict';

    let prevTime = 0;
    let game;
    let elapsedTime;
    let scoreElement;
    let isFinished = false;

    function update(elapsedTime) {
        // if(game.currCell === game.endCell) {
        //     isFinished = true;
        // }
        scoreElement.innerHTML = "Score: " + game.getScore();
    }

    function render(elapsedTime) {
        Graphics.beginRender();
        game.drawMaze();

        // if(isFinished) {
        //     alert("YOU WON!");
        //     isFinished = false;
        // }
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
        toggleAccordion();
        game = new MazeGame(5);

        scoreElement = document.getElementById("score");

        window.requestAnimationFrame(gameLoop);
        window.addEventListener('keydown', (e)=>{ game.keyDown(e, elapsedTime); });
    };

    return {
        toggleMazeSize
    };
})();