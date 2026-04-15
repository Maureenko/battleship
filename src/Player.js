// src/Player.js
import Gameboard from "./Gameboard.js";

export default class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
    this.attackedCells = new Set();

    // Smart AI state
    this.hitStack = [];      // cells hit but ship not yet sunk
    this.huntDirection = null; // "row" or "col" once direction is known
    this.huntPositive = true;  // which direction along the axis to try next
  }

  getComputerAttack() {
    // If we have hits to follow up on, hunt mode
    if (this.hitStack.length > 0) {
      return this.#getHuntAttack();
    }
    return this.#getRandomAttack();
  }

  #getRandomAttack() {
    let row, col, key;
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      key = `${row},${col}`;
    } while (this.attackedCells.has(key));
    return [row, col];
  }

  #getHuntAttack() {
    const [baseRow, baseCol] = this.hitStack[0];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // If we have 2+ hits, we know the axis — try to extend in that direction
    if (this.hitStack.length >= 2) {
      const [r1, c1] = this.hitStack[0];
      const [r2, c2] = this.hitStack[1];
      const dr = r2 - r1;
      const dc = c2 - c1;

      // Try extending beyond the last hit
      const last = this.hitStack[this.hitStack.length - 1];
      const next = [last[0] + dr, last[1] + dc];

      if (this.#isLegalAttack(next)) return next;

      // That direction is blocked — try the other end
      const first = this.hitStack[0];
      const prev = [first[0] - dr, first[1] - dc];
      if (this.#isLegalAttack(prev)) return prev;
    }

    // Only one hit so far — try all 4 neighbors
    for (const [dr, dc] of directions) {
      const candidate = [baseRow + dr, baseCol + dc];
      if (this.#isLegalAttack(candidate)) return candidate;
    }

    // Fallback — shouldn't happen in a valid game
    return this.#getRandomAttack();
  }

  #isLegalAttack([row, col]) {
    if (row < 0 || row >= 10 || col < 0 || col >= 10) return false;
    return !this.attackedCells.has(`${row},${col}`);
  }

  recordAttack([row, col]) {
    this.attackedCells.add(`${row},${col}`);
  }

  // Call this after every attack so the AI can update its hunt state
  processAttackResult([row, col], wasHit, shipSunk) {
    this.recordAttack([row, col]);

    if (wasHit) {
      this.hitStack.push([row, col]);
    }

    if (shipSunk) {
      // Ship is gone — clear the hunt stack and start fresh
      this.hitStack = [];
      this.huntDirection = null;
    }
  }
}