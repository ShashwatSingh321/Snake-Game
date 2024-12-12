const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const boxSize = 20;
const canvasSize = 400;

let snake = [{ x: 5 * boxSize, y: 5 * boxSize }];
let food = {
  x: Math.floor((Math.random() * canvasSize) / boxSize) * boxSize,
  y: Math.floor((Math.random() * canvasSize) / boxSize) * boxSize,
};
let direction = "";
let score = 0;
let gameInterval;

const eatSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
const gameOverSound = new Audio("https://www.soundjay.com/button/beep-10.wav");

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "lime" : "green";
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

function moveSnake() {
  const head = { ...snake[0] };

  if (direction === "UP") head.y -= boxSize;
  if (direction === "DOWN") head.y += boxSize;
  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "RIGHT") head.x += boxSize;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = {
      x: Math.floor((Math.random() * canvasSize) / boxSize) * boxSize,
      y: Math.floor((Math.random() * canvasSize) / boxSize) * boxSize,
    };
    eatSound.play();
  } else {
    snake.pop();
  }

  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    gameOverSound.play();
    alert("Game Over! Your score: " + score);
    resetGame();
  }
}

function resetGame() {
  snake = [{ x: 5 * boxSize, y: 5 * boxSize }];
  food = {
    x: Math.floor((Math.random() * canvasSize) / boxSize) * boxSize,
    y: Math.floor((Math.random() * canvasSize) / boxSize) * boxSize,
  };
  direction = "";
  score = 0;
  scoreDisplay.textContent = score;
  startGame();
}

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  drawSnake();
  drawFood();
  moveSnake();
}

function startGame() {
  gameInterval = setInterval(draw, 150);
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Handle button clicks (prevent default behavior)
["touchstart", "mousedown"].forEach((eventType) => {
  document.getElementById("up").addEventListener(eventType, (e) => {
    e.preventDefault();
    if (direction !== "DOWN") direction = "UP";
  });
  document.getElementById("down").addEventListener(eventType, (e) => {
    e.preventDefault();
    if (direction !== "UP") direction = "DOWN";
  });
  document.getElementById("left").addEventListener(eventType, (e) => {
    e.preventDefault();
    if (direction !== "RIGHT") direction = "LEFT";
  });
  document.getElementById("right").addEventListener(eventType, (e) => {
    e.preventDefault();
    if (direction !== "LEFT") direction = "RIGHT";
  });
});

// Start game
resetGame();
