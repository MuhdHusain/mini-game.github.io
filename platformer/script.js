// Get canvas + context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load your cartoon background
const background = new Image();
background.src = "img/cartoon.jpg";

// Sounds (optional, comment out if you don’t have them yet)
const jumpSound = new Audio("sounds/jump.wav");
const coinSound = new Audio("sounds/coin.wav");
const winSound = new Audio("sounds/win.wav");

// Stickman player
const player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  xSpeed: 0,
  ySpeed: 0,
  jumping: false
};

const gravity = 0.5;
const keys = {};

let score = 0;

// Example levels
let levels = [
  {
    platforms: [
      { x: 0, y: 370, width: 600, height: 30 },
      { x: 100, y: 300, width: 100, height: 10 },
      { x: 250, y: 250, width: 100, height: 10 },
      { x: 400, y: 200, width: 100, height: 10 },
    ],
    coins: [
      { x: 120, y: 270, collected: false },
      { x: 270, y: 220, collected: false },
      { x: 420, y: 170, collected: false },
    ],
    flag: { x: 500, y: 170, width: 20, height: 40 },
    enemies: [
      { x: 200, y: 350, width: 20, height: 20, dir: 1, speed: 1 },
    ]
  },
  {
    platforms: [
      { x: 0, y: 370, width: 600, height: 30 },
      { x: 150, y: 320, width: 100, height: 10 },
      { x: 300, y: 270, width: 100, height: 10 },
      { x: 450, y: 220, width: 100, height: 10 },
    ],
    coins: [
      { x: 170, y: 290, collected: false },
      { x: 320, y: 240, collected: false },
      { x: 470, y: 190, collected: false },
    ],
    flag: { x: 550, y: 180, width: 20, height: 40 },
    enemies: [
      { x: 350, y: 300, width: 20, height: 20, dir: -1, speed: 1 },
    ]
  }
];

let currentLevel = 0;
let platforms = levels[currentLevel].platforms;
let coins = levels[currentLevel].coins;
let flag = levels[currentLevel].flag;
let enemies = levels[currentLevel].enemies;

document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

function update() {
  // Controls
  if (keys["ArrowLeft"]) {
    player.xSpeed = -3;
  } else if (keys["ArrowRight"]) {
    player.xSpeed = 3;
  } else {
    player.xSpeed = 0;
  }

  if (keys["Space"] && !player.jumping) {
    player.ySpeed = -10;
    player.jumping = true;
    jumpSound.play();
  }

  // Gravity
  player.ySpeed += gravity;

  // Move player
  player.x += player.xSpeed;
  player.y += player.ySpeed;

  // Collision with platforms
  platforms.forEach(platform => {
    if (player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y < platform.y + platform.height &&
        player.y + player.height > platform.y) {
      player.y = platform.y - player.height;
      player.ySpeed = 0;
      player.jumping = false;
    }
  });

  // Ground fallback
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.ySpeed = 0;
    player.jumping = false;
  }

  // Collect coins
  coins.forEach(coin => {
    if (!coin.collected &&
      player.x < coin.x + 10 &&
      player.x + player.width > coin.x &&
      player.y < coin.y + 10 &&
      player.y + player.height > coin.y) {
      coin.collected = true;
      score++;
      coinSound.play();
      document.getElementById("score").innerText = score;
    }
  });

  // Move enemies & check collision
  enemies.forEach(enemy => {
    enemy.x += enemy.speed * enemy.dir;
    if (enemy.x < 50 || enemy.x > 550) {
      enemy.dir *= -1;
    }

    if (player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y) {
      document.getElementById("winMessage").innerText = "💀 You hit an enemy! Restarting...";
      resetLevel();
    }
  });

  // Check for level complete
  const allCollected = coins.every(coin => coin.collected);
  if (allCollected &&
    player.x < flag.x + flag.width &&
    player.x + player.width > flag.x &&
    player.y < flag.y + flag.height &&
    player.y + player.height > flag.y) {

    currentLevel++;
    winSound.play();

    if (currentLevel < levels.length) {
      loadLevel(currentLevel);
    } else {
      document.getElementById("winMessage").innerText = "🏆 You finished all levels!";
    }
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  // Draw background
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Draw stickman
  drawStickman(player.x + player.width / 2, player.y + player.height / 2);

  // Draw platforms
  ctx.fillStyle = "white";
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  // Draw coins
  coins.forEach(coin => {
    if (!coin.collected) {
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw flag
  ctx.fillStyle = "red";
  ctx.fillRect(flag.x, flag.y, flag.width, flag.height);

  // Draw enemies
  ctx.fillStyle = "purple";
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Stickman drawing
function drawStickman(x, y) {
  ctx.strokeStyle = "#0f0"; // Green stickman
  ctx.lineWidth = 2;

  // Head
  ctx.beginPath();
  ctx.arc(x, y - 15, 5, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(x, y - 5);
  ctx.lineTo(x - 5, y + 5);
  ctx.moveTo(x, y - 5);
  ctx.lineTo(x + 5, y + 5);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(x, y + 10);
  ctx.lineTo(x - 5, y + 20);
  ctx.moveTo(x, y + 10);
  ctx.lineTo(x + 5, y + 20);
  ctx.stroke();
}

// Load next level
function loadLevel(levelIndex) {
  platforms = levels[levelIndex].platforms;
  coins = levels[levelIndex].coins;
  flag = levels[levelIndex].flag;
  enemies = levels[levelIndex].enemies;
  resetLevel();
}

// Reset position + coins
function resetLevel() {
  player.x = 50;
  player.y = 300;
  player.xSpeed = 0;
  player.ySpeed = 0;
  levels[currentLevel].coins.forEach(c => c.collected = false);
}

update();
