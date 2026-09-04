const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


// ========================================
// GAME SETTINGS
// ========================================

const TILE_SIZE = 20;

const COLS = canvas.width / TILE_SIZE;
const ROWS = canvas.height / TILE_SIZE;

const GAME_SPEED = 100;


// ========================================
// SNAKE
// ========================================

let snake = [
    {
        x: 15,
        y: 15
    },

    {
        x: 14,
        y: 15
    },

    {
        x: 13,
        y: 15
    }
];


// ========================================
// DIRECTION
// ========================================

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};


// ========================================
// FOOD
// ========================================

let food = {
    x: 20,
    y: 15
};


// ========================================
// GAME STATE
// ========================================

let score = 0;

let gameOver = false;

let gameStarted = false;


// ========================================
// INPUT
// ========================================

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();


    // ------------------------------------
    // START / RESTART
    // ------------------------------------

    if (event.code === "Space") {

        event.preventDefault();

        if (gameOver) {

            resetGame();

        }
        else {

            gameStarted = true;
        }

        return;
    }


    // ------------------------------------
    // UP
    // ------------------------------------

    if (
        key === "w" ||
        event.key === "ArrowUp"
    ) {

        if (direction.y !== 1) {

            nextDirection = {
                x: 0,
                y: -1
            };
        }
    }


    // ------------------------------------
    // DOWN
    // ------------------------------------

    if (
        key === "s" ||
        event.key === "ArrowDown"
    ) {

        if (direction.y !== -1) {

            nextDirection = {
                x: 0,
                y: 1
            };
        }
    }


    // ------------------------------------
    // LEFT
    // ------------------------------------

    if (
        key === "a" ||
        event.key === "ArrowLeft"
    ) {

        if (direction.x !== 1) {

            nextDirection = {
                x: -1,
                y: 0
            };
        }
    }


    // ------------------------------------
    // RIGHT
    // ------------------------------------

    if (
        key === "d" ||
        event.key === "ArrowRight"
    ) {

        if (direction.x !== -1) {

            nextDirection = {
                x: 1,
                y: 0
            };
        }
    }

});


// ========================================
// UPDATE
// ========================================

function update() {

    if (!gameStarted || gameOver) {
        return;
    }


    // ====================================
    // CHANGE DIRECTION
    // ====================================

    direction = nextDirection;


    // ====================================
    // CREATE NEW HEAD
    // ====================================

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };


    // ====================================
    // WALL COLLISION
    // ====================================

    if (
        head.x < 0 ||
        head.x >= COLS ||
        head.y < 0 ||
        head.y >= ROWS
    ) {

        endGame();

        return;
    }


    // ====================================
    // SELF COLLISION
    // ====================================

    if (snakeCollision(head)) {

        endGame();

        return;
    }


    // ====================================
    // ADD HEAD
    // ====================================

    snake.unshift(head);


    // ====================================
    // FOOD COLLISION
    // ====================================

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        spawnFood();

    }
    else {

        // Remove tail
        snake.pop();
    }
}


// ========================================
// SNAKE COLLISION
// ========================================

function snakeCollision(head) {

    for (let segment of snake) {

        if (
            head.x === segment.x &&
            head.y === segment.y
        ) {

            return true;
        }
    }

    return false;
}


// ========================================
// SPAWN FOOD
// ========================================

function spawnFood() {

    let validPosition = false;

    while (!validPosition) {

        food.x =
            Math.floor(Math.random() * COLS);

        food.y =
            Math.floor(Math.random() * ROWS);


        validPosition = true;


        // Make sure food isn't inside snake
        for (let segment of snake) {

            if (
                food.x === segment.x &&
                food.y === segment.y
            ) {

                validPosition = false;

                break;
            }
        }
    }
}


// ========================================
// END GAME
// ========================================

function endGame() {

    gameOver = true;
}


// ========================================
// RESET GAME
// ========================================

function resetGame() {

    snake = [

        {
            x: 15,
            y: 15
        },

        {
            x: 14,
            y: 15
        },

        {
            x: 13,
            y: 15
        }
    ];


    direction = {
        x: 1,
        y: 0
    };


    nextDirection = {
        x: 1,
        y: 0
    };


    score = 0;

    gameOver = false;

    gameStarted = true;


    spawnFood();
}


// ========================================
// DRAW
// ========================================

function draw() {

    // ====================================
    // BACKGROUND
    // ====================================

    ctx.fillStyle = "black";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ====================================
    // GRID
    // ====================================

    ctx.strokeStyle = "#222";

    ctx.lineWidth = 1;


    for (let x = 0; x < COLS; x++) {

        ctx.beginPath();

        ctx.moveTo(
            x * TILE_SIZE,
            0
        );

        ctx.lineTo(
            x * TILE_SIZE,
            canvas.height
        );

        ctx.stroke();
    }


    for (let y = 0; y < ROWS; y++) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y * TILE_SIZE
        );

        ctx.lineTo(
            canvas.width,
            y * TILE_SIZE
        );

        ctx.stroke();
    }


    // ====================================
    // SNAKE
    // ====================================

    ctx.fillStyle = "lime";

    for (let segment of snake) {

        ctx.fillRect(
            segment.x * TILE_SIZE,
            segment.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
        );
    }


    // ====================================
    // FOOD
    // ====================================

    ctx.fillStyle = "red";

    ctx.fillRect(
        food.x * TILE_SIZE,
        food.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );


    // ====================================
    // SCORE
    // ====================================

    ctx.fillStyle = "white";

    ctx.font = "25px Arial";

    ctx.textAlign = "left";

    ctx.fillText(
        "Score: " + score,
        15,
        30
    );


    // ====================================
    // START SCREEN
    // ====================================

    if (!gameStarted) {

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.7)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "white";

        ctx.font = "40px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "SNAKE",
            canvas.width / 2,
            canvas.height / 2 - 30
        );


        ctx.font = "20px Arial";

        ctx.fillText(
            "Press SPACE to start",
            canvas.width / 2,
            canvas.height / 2 + 20
        );
    }


    // ====================================
    // GAME OVER SCREEN
    // ====================================

    if (gameOver) {

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.7)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "white";

        ctx.font = "45px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            canvas.height / 2 - 20
        );


        ctx.font = "25px Arial";

        ctx.fillText(
            "Score: " + score,
            canvas.width / 2,
            canvas.height / 2 + 25
        );


        ctx.font = "20px Arial";

        ctx.fillText(
            "Press SPACE to restart",
            canvas.width / 2,
            canvas.height / 2 + 65
        );
    }
}


// ========================================
// GAME LOOP
// ========================================

function gameLoop() {

    update();

    draw();
}


// ========================================
// GAME TIMER
// ========================================

setInterval(
    gameLoop,
    GAME_SPEED
);


// ========================================
// START
// ========================================

draw();