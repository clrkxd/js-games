const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// GAME SETTINGS

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

const PIPE_SPEED = 3;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_INTERVAL = 1500;

// BIRD


const bird = {
    x: 80,
    y: 300,

    width: 30,
    height: 30,

    velocity: 0,

    gravity: 0.5,
    jumpForce: -8
};

// GAME VARIABLES

let pipes = [];

let score = 0;

let gameOverState = false;

let lastPipeTime = 0;

// CREATE PIPE

function createPipe() {

    // Random height for the top pipe
    const topHeight =
        Math.random() * 250 + 50;

    const pipe = {

        x: GAME_WIDTH,

        width: PIPE_WIDTH,

        topHeight: topHeight,

        bottomY: topHeight + PIPE_GAP,

        passed: false
    };

    pipes.push(pipe);
}



// UPDATE GAME

function update() {

    if (gameOverState) {
        return;
    }


    // BIRD PHYSICS

    bird.velocity += bird.gravity;

    bird.y += bird.velocity;


    // CREATE PIPES

    const currentTime = Date.now();

    if (
        currentTime - lastPipeTime >
        PIPE_INTERVAL
    ) {

        createPipe();

        lastPipeTime = currentTime;
    }


    // MOVE PIPES

    for (let pipe of pipes) {

        pipe.x -= PIPE_SPEED;
    }


    // SCORE

    for (let pipe of pipes) {

        if (
            !pipe.passed &&
            pipe.x + pipe.width < bird.x
        ) {

            pipe.passed = true;

            score++;
        }
    }


    // COLLISION WITH PIPES

    for (let pipe of pipes) {

        if (collision(bird, pipe)) {

            gameOver();
        }
    }


    // CEILING

    if (bird.y < 0) {

        gameOver();
    }


    // ----------------------------
    // GROUND
    // ----------------------------

    if (
        bird.y + bird.height >
        GAME_HEIGHT
    ) {

        gameOver();
    }


    // ----------------------------
    // REMOVE OLD PIPES
    // ----------------------------

    pipes = pipes.filter(
        pipe => pipe.x + pipe.width > 0
    );
}


// ================================
// COLLISION DETECTION
// ================================

function collision(bird, pipe) {

    const birdRight =
        bird.x + bird.width;

    const birdBottom =
        bird.y + bird.height;

    const pipeRight =
        pipe.x + pipe.width;


    // Is bird horizontally inside pipe?
    const hitPipeX =
        birdRight > pipe.x &&
        bird.x < pipeRight;


    // Is bird touching top pipe?
    const hitTop =
        bird.y < pipe.topHeight;


    // Is bird touching bottom pipe?
    const hitBottom =
        birdBottom > pipe.bottomY;


    return (
        hitPipeX &&
        (hitTop || hitBottom)
    );
}


// ================================
// DRAW GAME
// ================================

function draw() {

    // ----------------------------
    // BACKGROUND
    // ----------------------------

    ctx.fillStyle = "skyblue";

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    // ----------------------------
    // BIRD
    // ----------------------------

    ctx.fillStyle = "yellow";

    ctx.fillRect(
        bird.x,
        bird.y,
        bird.width,
        bird.height
    );


    // ----------------------------
    // PIPES
    // ----------------------------

    ctx.fillStyle = "green";

    for (let pipe of pipes) {

        // Top pipe
        ctx.fillRect(
            pipe.x,
            0,
            pipe.width,
            pipe.topHeight
        );


        // Bottom pipe
        ctx.fillRect(
            pipe.x,
            pipe.bottomY,
            pipe.width,
            GAME_HEIGHT - pipe.bottomY
        );
    }


    // ----------------------------
    // SCORE
    // ----------------------------

    ctx.fillStyle = "white";

    ctx.font = "32px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        score,
        GAME_WIDTH / 2,
        50
    );


    // ----------------------------
    // GAME OVER SCREEN
    // ----------------------------

    if (gameOverState) {

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.5)";

        ctx.fillRect(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );


        ctx.fillStyle = "white";

        ctx.font = "40px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2
        );


        ctx.font = "20px Arial";

        ctx.fillText(
            "Press SPACE to restart",
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2 + 40
        );
    }
}


// ================================
// GAME OVER
// ================================

function gameOver() {

    gameOverState = true;
}


// ================================
// RESET GAME
// ================================

function resetGame() {

    bird.x = 80;
    bird.y = 300;

    bird.velocity = 0;

    pipes = [];

    score = 0;

    gameOverState = false;

    lastPipeTime = Date.now();
}


// ================================
// INPUT
// ================================

document.addEventListener(
    "keydown",
    function(event) {

        // SPACE
        if (event.code === "Space") {

            event.preventDefault();


            // Restart if game over
            if (gameOverState) {

                resetGame();

                return;
            }


            // Bird jump
            bird.velocity =
                bird.jumpForce;
        }
    }
);


// ================================
// MOUSE INPUT
// ================================

canvas.addEventListener(
    "mousedown",
    function() {

        if (gameOverState) {

            resetGame();

            return;
        }


        bird.velocity =
            bird.jumpForce;
    }
);


// ================================
// TOUCH INPUT
// ================================

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();


        if (gameOverState) {

            resetGame();

            return;
        }


        bird.velocity =
            bird.jumpForce;
    }
);


// ================================
// GAME LOOP
// ================================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);
}


// ================================
// START GAME
// ================================

resetGame();

gameLoop();