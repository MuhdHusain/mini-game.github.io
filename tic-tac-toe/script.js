const board = document.getElementById("gameBoard");
const status = document.getElementById("status");
let cells = [];
let currentPlayer = "X";
let gameActive = true;

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", cellClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function cellClick(e) {
  const cell = e.target;
  if (cell.textContent !== "" || !gameActive) return;

  cell.textContent = currentPlayer;
  if (checkWin()) {
    status.textContent = `${currentPlayer} Wins!`;
    gameActive = false;
  } else if (isDraw()) {
    status.textContent = `It's a Draw!`;
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function checkWin() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return cells[a].textContent === currentPlayer &&
           cells[b].textContent === currentPlayer &&
           cells[c].textContent === currentPlayer;
  });
}

function isDraw() {
  return cells.every(cell => cell.textContent !== "");
}

function resetGame() {
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
  gameActive = true;
  status.textContent = `Player X's Turn`;
}

createBoard();
status.textContent = `Player X's Turn`;
