// src/dragManager.js
import { highlightCells, clearHighlights } from "./domManager.js";

let dragState = null;

export function buildDock(dockEl, shipsToPlace, getOrientation) {
  dockEl.innerHTML = "";

  shipsToPlace.forEach(({ length, name }, index) => {
    const shipEl = document.createElement("div");
    shipEl.classList.add("dock-ship");
    shipEl.dataset.index = index;
    shipEl.dataset.length = length;
    shipEl.dataset.name = name;
    shipEl.draggable = true;
    shipEl.title = `${name} (length ${length}) — Press R to rotate`;

    for (let i = 0; i < length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("dock-cell");
      cell.dataset.cellIndex = i; // track which cell of the ship was grabbed
      shipEl.appendChild(cell);
    }

    dockEl.appendChild(shipEl);
  });

  dockEl.addEventListener("dragstart", (e) => {
    const shipEl = e.target.closest(".dock-ship");
    if (!shipEl) return;

    // Which cell inside the ship was grabbed?
    const grabbedCell = e.target.closest(".dock-cell");
    const cellOffset = grabbedCell ? parseInt(grabbedCell.dataset.cellIndex) : 0;

    dragState = {
      shipIndex:   parseInt(shipEl.dataset.index),
      length:      parseInt(shipEl.dataset.length),
      name:        shipEl.dataset.name,
      orientation: getOrientation(),
      cellOffset: 0,  // <-- the key fix
    };

    e.dataTransfer.setData("text/plain", shipEl.dataset.index);
    e.dataTransfer.effectAllowed = "move";
  });
}

export function attachBoardDragListeners(boardEl, game, onPlaced) {
  boardEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dragState) return;

    const cell = e.target.closest(".cell");
    if (!cell) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Shift the preview origin back by the grab offset
    const { length, orientation, cellOffset } = dragState;
    const startRow = orientation === "vertical"   ? row - cellOffset : row;
    const startCol = orientation === "horizontal" ? col - cellOffset : col;

    const valid = isPlacementValid(game, startRow, startCol, length, orientation);
    highlightCells(boardEl, startRow, startCol, length, orientation, valid);
  });

  boardEl.addEventListener("dragleave", (e) => {
    if (!boardEl.contains(e.relatedTarget)) {
      clearHighlights(boardEl);
    }
  });

  boardEl.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!dragState) return;

    const cell = e.target.closest(".cell");
    if (!cell) return;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    const { length, orientation, cellOffset } = dragState;

    // Apply the same offset so drop lands exactly where preview showed
    const startRow = orientation === "vertical"   ? row - cellOffset : row;
    const startCol = orientation === "horizontal" ? col - cellOffset : col;

    clearHighlights(boardEl);

    const success = game.placeHumanShip([startRow, startCol], length, orientation);

    if (success) {
      onPlaced(dragState.shipIndex);
    }

    dragState = null;
  });
}

// ── Helpers ───────────────────────────────────────────────────────

function isPlacementValid(game, row, col, length, orientation) {
  for (let i = 0; i < length; i++) {
    const r = orientation === "vertical"   ? row + i : row;
    const c = orientation === "horizontal" ? col + i : col;

    if (r < 0 || r >= 10 || c < 0 || c >= 10) return false;
    if (game.human.gameboard.getCell([r, c]) !== null) return false;
  }
  return true;
}