const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// GAME SETTINGS

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const WIN_SCORE = 5;


 // PADDLE SETTINGS

const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 6;


// PLAYER 1
// W / S

const player1 = {
    x: 30,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,

    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,

    speed: PADDLE_SPEED,

    score: 0
};


// PLAYER 2
// ARROW UP / ARROW DOWN

const player2 = {
    x: WIDTH - 30 - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,

    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED,

    score: 0
};


// BALL

const ball = {
    x: WIDTH / 2,
    y: HEIGHT / 2,

    size: 15,
    speed: 5,
    velocityX: 5,
    velocityY: 3
};


// GAME STATE

let gameOver = false;


// KEYBOARD INPUT

const keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

    // Prevent page scrolling
    if (
        event.code === "Space" ||
        event.code === "ArrowUp" ||
        event.code === "ArrowDown"
    ) {
        event.preventDefault();
    }


    // Restart game
    if (event.code === "Space" && gameOver
    ) {
        resetGame();
    }
});


document.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;
});


// UPDATE

function update() {

    // Don't update anything when game is over
    if (gameOver) {
        return;
    }


    // PLAYER 1 MOVEMENT

    if (keys["w"]) {
        player1.y -= player1.speed;
    }

    if (keys["s"]) {
        player1.y += player1.speed;
    }


    // PLAYER 2 MOVEMENT

    if (keys["arrowup"]) {
        player2.y -= player2.speed;
    }

    if (keys["arrowdown"]) {
        player2.y += player2.speed;
    }


    // KEEP PADDLES INSIDE SCREEN

    keepPaddleInside(player1);
    keepPaddleInside(player2);


    // MOVE BALL

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;


    // BALL VS TOP / BOTTOM

    if (ball.y <= 0) {

        ball.y = 0;

        ball.velocityY *= -1;
    }

    if (ball.y + ball.size >= HEIGHT) {

        ball.y = HEIGHT - ball.size;

        ball.velocityY *= -1;
    }


    // BALL VS PLAYER 1

    if (ballCollision(ball, player1)) {

        ball.x = player1.x + player1.width;

        ball.velocityX = Math.abs(ball.velocityX);

        increaseBallSpeed();
    }


    // BALL VS PLAYER 2

    if (ballCollision(ball, player2)) {

        ball.x = player2.x - ball.size;

        ball.velocityX = -Math.abs(ball.velocityX);

        increaseBallSpeed();
    }


    // PLAYER 2 SCORES

    if (ball.x + ball.size < 0) {

        player2.score++;

        checkWinner();

        if (!gameOver) {
            resetBall();
        }
    }


    // PLAYER 1 SCORES

    if (ball.x > WIDTH) {

        player1.score++;

        checkWinner();

        if (!gameOver) {
            resetBall();
        }
    }
}


// KEEP PADDLE INSIDE CANVAS

function keepPaddleInside(player) {

    if (player.y < 0) {

        player.y = 0;
    }


    if (player.y + player.height > HEIGHT) {

        player.y = HEIGHT - player.height;
    }
}


// BALL COLLISION

function ballCollision(ball, player) {

    return (
        ball.x < player.x + player.width &&
        ball.x + ball.size > player.x &&
        ball.y < player.y + player.height &&
        ball.y + ball.size > player.y
    );
}


// INCREASE BALL SPEED

function increaseBallSpeed() {

    const direction =
        ball.velocityX > 0 ? 1 : -1;

    ball.speed += 0.3;

    ball.velocityX =
        direction * ball.speed;
}


// RESET BALL

function resetBall() {

    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;

    ball.speed = 5;


    // Random horizontal direction
    const direction =
        Math.random() < 0.5 ? -1 : 1;


    ball.velocityX =
        direction * ball.speed;


    // Random vertical direction
    ball.velocityY =
        Math.random() * 4 - 2;


    // Prevent the ball from moving
    // almost completely horizontally
    if (Math.abs(ball.velocityY) < 1) {

        ball.velocityY = 2;
    }
}


// RESET ENTIRE GAME

function resetGame() {

    // Reset scores
    player1.score = 0;
    player2.score = 0;


    // Reset player positions
    player1.y =
        HEIGHT / 2 - player1.height / 2;

    player2.y =
        HEIGHT / 2 - player2.height / 2;


    // Reset ball
    resetBall();


    // Resume game
    gameOver = false;
}


// CHECK WINNER

function checkWinner() {

    if (player1.score >= WIN_SCORE) {

        gameOver = true;
    }


    if (player2.score >= WIN_SCORE) {

        gameOver = true;
    }
}


// DRAW

function draw() {

    // BACKGROUND

    ctx.fillStyle = "black";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // CENTER LINE

    ctx.strokeStyle = "white";

    ctx.lineWidth = 2;

    ctx.setLineDash([10, 10]);

    ctx.beginPath();

    ctx.moveTo(
        WIDTH / 2,
        0
    );

    ctx.lineTo(
        WIDTH / 2,
        HEIGHT
    );

    ctx.stroke();

    ctx.setLineDash([]);


    // PLAYER 1

    ctx.fillStyle = "white";

    ctx.fillRect(
        player1.x,
        player1.y,
        player1.width,
        player1.height
    );


    // PLAYER 2

    ctx.fillRect(
        player2.x,
        player2.y,
        player2.width,
        player2.height
    );


    // BALL

    ctx.fillRect(
        ball.x,
        ball.y,
        ball.size,
        ball.size
    );


    // SCORE

    ctx.font = "50px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        player1.score,
        WIDTH / 2 - 80,
        60
    );

    ctx.fillText(
        player2.score,
        WIDTH / 2 + 80,
        60
    );


    // GAME OVER SCREEN

    if (gameOver) {

        // Dark overlay
        ctx.fillStyle =
            "rgba(0, 0, 0, 0.7)";

        ctx.fillRect(
            0,
            0,
            WIDTH,
            HEIGHT
        );


        // Winner
        ctx.fillStyle = "white";

        ctx.font = "50px Arial";

        let winner;


        if (player1.score >= WIN_SCORE) {

            winner = "PLAYER 1 WINS!";
        }
        else {

            winner = "PLAYER 2 WINS!";
        }


        ctx.fillText(
            winner,
            WIDTH / 2,
            HEIGHT / 2
        );


        // Restart text
        ctx.font = "25px Arial";

        ctx.fillText(
            "PRESS SPACE TO RESTART",
            WIDTH / 2,
            HEIGHT / 2 + 50
        );
    }
}


// GAME LOOP

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);
}


// START GAME


resetGame();

gameLoop();
