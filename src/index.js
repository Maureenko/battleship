// src/index.js
import GameController from "./GameController.js";
import Gameboard from "./Gameboard.js";
import { renderBoard, showMessage } from "./domManager.js";
import { buildDock, attachBoardDragListeners } from "./dragManager.js";

const game = new GameController();

const humanBoardEl = document.querySelector("#human-board");
const computerBoardEl = document.querySelector("#computer-board");
const enemySection = document.querySelector("#enemy-section");
const dockEl = document.querySelector("#ships-to-place");
const randomBtn = document.querySelector("#random-place");
const resetBtn = document.querySelector("#reset-place");
const placementInfo = document.querySelector("#placement-info");

// Track which dock ships have been placed (by index)
const placedIndices = new Set();

// ── Init ──────────────────────────────────────────────────────────

function init() {
  placedIndices.clear();
  game.human.gameboard = new Gameboard();
  game.placementPhase = true;

  renderBoard(game.human.gameboard, humanBoardEl, false);
  renderBoard(game.computer.gameboard, computerBoardEl, true);

  buildDock(dockEl, game.shipsToPlace, () => game.orientation);
  updateDockInfo();

  attachBoardDragListeners(humanBoardEl, game, (shipIndex) => {
    // Mark that dock ship as placed
    placedIndices.add(shipIndex);
    markDockShipPlaced(shipIndex);
    renderBoard(game.human.gameboard, humanBoardEl, false);
    updateDockInfo();

    if (!game.placementPhase) startGame();
  });
}

function markDockShipPlaced(index) {
  const shipEl = dockEl.querySelector(`[data-index="${index}"]`);
  if (shipEl) shipEl.classList.add("placed");
}

function updateDockInfo() {
  const remaining = game.shipsToPlace.length - placedIndices.size;
  placementInfo.textContent = remaining > 0
    ? `${remaining} ship${remaining > 1 ? "s" : ""} left to place`
    : "All ships placed!";
}

function startGame() {
  showMessage("All ships placed! Attack the enemy board.");
  document.querySelector("#ship-dock").style.display = "none";
  enemySection.classList.add("active");
}

// ── Orientation toggle (keyboard shortcut) ────────────────────────

// Press R to rotate during drag
window.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    game.toggleOrientation();
    showMessage(`Orientation: ${game.orientation}`);
  }
});

// ── Random placement ──────────────────────────────────────────────

randomBtn.addEventListener("click", () => {
  game.human.gameboard = new Gameboard();
  placedIndices.clear();

  for (const { length } of game.shipsToPlace) {
    let placed = false;
    while (!placed) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const dir = Math.random() < 0.5 ? "horizontal" : "vertical";
      try {
        game.human.gameboard.placeShip(length, [row, col], dir);
        placed = true;
      } catch { /* retry */ }
    }
  }

  // Mark all as placed
  game.shipsToPlace.forEach((_, i) => placedIndices.add(i));
  game.placementPhase = false;

  renderBoard(game.human.gameboard, humanBoardEl, false);
  dockEl.querySelectorAll(".dock-ship").forEach(el => el.classList.add("placed"));
  updateDockInfo();
  startGame();
});

// ── Reset placement ───────────────────────────────────────────────

resetBtn.addEventListener("click", () => {
  init();
  showMessage("Drag your ships onto your board!");
});

// ── Game phase — attack clicks ────────────────────────────────────

computerBoardEl.addEventListener("click", (e) => {
  if (game.placementPhase || game.gameOver) return;

  const cell = e.target.closest(".cell");
  if (!cell) return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  try {
    const result = game.humanAttack([row, col]);
    renderBoard(game.human.gameboard, humanBoardEl, false);
    renderBoard(game.computer.gameboard, computerBoardEl, true);

    if (result?.winner === "human") showMessage("🎉 You win!");
    else if (result?.winner === "computer") showMessage("💀 Computer wins!");
    else showMessage("Your turn — keep attacking!");
  } catch {
    // Already attacked this cell — do nothing
  }
});

// ── Start ─────────────────────────────────────────────────────────

init();