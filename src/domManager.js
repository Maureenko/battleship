// src/domManager.js

export function renderBoard(gameboard, boardEl, isEnemy) {
  boardEl.innerHTML = "";

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;

      const value = gameboard.getCell([r, c]);
      if (value === "hit")        cell.classList.add("hit");
      else if (value === "miss")  cell.classList.add("miss");
      else if (value === "ship" && !isEnemy) cell.classList.add("ship");

      boardEl.appendChild(cell);
    }
  }
}

export function highlightCells(boardEl, row, col, length, orientation, isValid) {
  // Clear previous highlights first
  boardEl.querySelectorAll(".preview, .preview-invalid").forEach((el) => {
    el.classList.remove("preview", "preview-invalid");
  });

  for (let i = 0; i < length; i++) {
    const r = orientation === "vertical"   ? row + i : row;
    const c = orientation === "horizontal" ? col + i : col;

    // Skip out-of-bounds cells — don't try to query them
    if (r < 0 || r >= 10 || c < 0 || c >= 10) continue;

    const cell = boardEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (cell) {
      cell.classList.add(isValid ? "preview" : "preview-invalid");
    }
  }
}

export function clearHighlights(boardEl) {
  boardEl.querySelectorAll(".preview, .preview-invalid").forEach((el) => {
    el.classList.remove("preview", "preview-invalid");
  });
}

export function showMessage(msg) {
  document.querySelector("#message").textContent = msg;
}