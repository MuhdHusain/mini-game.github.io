const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};
let direction;
let score = 0;

document.addEventListener("keydown", directionControl);

function directionControl(e) {
  if (e.keyCode == 37 && direction != "RIGHT") direction = "LEFT";
  else if (e.keyCode == 38 && direction != "DOWN") direction = "UP";
  else if (e.keyCode == 39 && direction != "LEFT") direction = "RIGHT";
  else if (e.keyCode == 40 && direction != "UP") direction = "DOWN";
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, 400, 400);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "lime" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction == "LEFT") snakeX -= box;
  if (direction == "UP") snakeY -= box;
  if (direction == "RIGHT") snakeX += box;
  if (direction == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 || snakeY < 0 || snakeX >= 400 || snakeY >= 400 ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Your score: " + score);
  }

  snake.unshift(newHead);
}

function collision(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x == arr[i].x && head.y == arr[i].y) return true;
  }
  return false;
}

let game = setInterval(draw, 100);
