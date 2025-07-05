let grid;
const size = 4;
const container = document.getElementById("grid-container");

function init() {
  grid = Array(size).fill().map(() => Array(size).fill(0));
  addTile();
  addTile();
  draw();
}

function draw() {
  container.innerHTML = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      if (grid[r][c] !== 0) {
        tile.textContent = grid[r][c];
        tile.setAttribute("data-value", grid[r][c]);
      }
      container.appendChild(tile);
    }
  }
}

function addTile() {
  const empty = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() > 0.1 ? 2 : 4;
}

function move(dir) {
  let moved = false;
  for (let i = 0; i < size; i++) {
    let row = getLine(i, dir);
    let original = [...row];
    row = slide(row);
    setLine(i, row, dir);
    if (!arraysEqual(row, original)) moved = true;
  }
  if (moved) {
    addTile();
    draw();
    if (isGameOver()) alert("Game Over!");
  }
}

function slide(row) {
  let arr = row.filter(v => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  return arr.filter(v => v).concat(Array(size - arr.filter(v => v).length).fill(0));
}

function getLine(i, dir) {
  let row = [];
  for (let j = 0; j < size; j++) {
    switch (dir) {
      case "left": row.push(grid[i][j]); break;
      case "right": row.push(grid[i][size - 1 - j]); break;
      case "up": row.push(grid[j][i]); break;
      case "down": row.push(grid[size - 1 - j][i]); break;
    }
  }
  return row;
}

function setLine(i, row, dir) {
  for (let j = 0; j < size; j++) {
    switch (dir) {
      case "left": grid[i][j] = row[j]; break;
      case "right": grid[i][size - 1 - j] = row[j]; break;
      case "up": grid[j][i] = row[j]; break;
      case "down": grid[size - 1 - j][i] = row[j]; break;
    }
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function isGameOver() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) return false;
      if (c < size - 1 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < size - 1 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

function resetGame() {
  init();
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  const dirMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  };
  if (dirMap[e.key]) {
    e.preventDefault();
    move(dirMap[e.key]);
  }
});

// Touch support
let startX, startY;
document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
document.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
});

init();