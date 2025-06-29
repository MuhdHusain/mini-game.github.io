const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
    flag: { x: 500, y: 170, width: 20, height: 40 }
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
    flag: { x: 550, y: 180, width: 20, height: 40 }
  },
  {
    platforms: [
      { x: 0, y: 370, width: 600, height: 30 },
      { x: 80, y: 320, width: 80, height: 10 },
      { x: 180, y: 270, width: 80, height: 10 },
      { x: 280, y: 220, width: 80, height: 10 },
      { x: 380, y: 170, width: 80, height: 10 },
      { x: 480, y: 120, width: 80, height: 10 },
    ],
    coins: [
      { x: 100, y: 290, collected: false },
      { x: 200, y: 240, collected: false },
      { x: 300, y: 190, collected: false },
      { x: 400, y: 140, collected: false },
      { x: 500, y: 90, collected: false },
    ],
    flag: { x: 550, y: 80, width: 20, height: 40 }
  }
];

let currentLevel = 0;
let platforms = levels[currentLevel].platforms;
let coins = levels[currentLevel].coins;
let flag = levels[currentLevel].flag;

let score = 0;

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
      document.getElementById("score").innerText = score;
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

    if (currentLevel < levels.length) {
      // Load next level
      platforms = levels[currentLevel].platforms;
      coins = levels[currentLevel].coins;
      flag = levels[currentLevel].flag;
      player.x = 50;
      player.y = 300;
    } else {
      document.getElementById("winMessage").innerText = "🏆 You finished all levels!";
    }
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Determine player state
  let playerState = "idle";
  if (player.jumping) {
    playerState = "jumping";
  } else if (player.xSpeed !== 0) {
    playerState = "running";
  }

  // Draw stickman
  drawStickman(player.x + player.width / 2, player.y + player.height / 2, playerState);

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
}

function drawStickman(x, y, state) {
  ctx.strokeStyle = "#0f0"; // green stickman
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

  // Arms + Legs depend on state
  ctx.beginPath();

  if (state === "idle") {
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x - 5, y + 5);
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x + 5, y + 5);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x - 5, y + 20);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x + 5, y + 20);
  } else if (state === "running") {
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x - 7, y + 5);
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x + 7, y + 5);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x - 7, y + 20);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x + 7, y + 20);
  } else if (state === "jumping") {
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x - 7, y - 2);
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x + 7, y - 2);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x - 3, y + 20);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x + 3, y + 20);
  }

  ctx.stroke();
}

update();
