import Ship from "./Ship.js";

export default class Gameboard {
  constructor() {
    // 10x10 grid, each cell is null by default
    this.grid = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [];       // { ship, cells[] } objects
    this.missedAttacks = [];
    this.attackedCells = new Set();
  }

  // Returns what's visually at a cell: null, "ship", or "hit"
  getCell([row, col]) {
    return this.grid[row][col];
  }

  placeShip(length, [row, col], direction) {
    const cells = [];

    for (let i = 0; i < length; i++) {
      const r = direction === "vertical" ? row + i : row;
      const c = direction === "horizontal" ? col + i : col;

      if (r >= 10 || c >= 10) throw new Error("Ship out of bounds");
      if (this.grid[r][c] !== null) throw new Error("Cell already occupied");

      cells.push([r, c]);
    }

    const ship = new Ship(length);
    this.ships.push({ ship, cells });

    // Mark each cell with a reference to the ship object
    cells.forEach(([r, c]) => {
      this.grid[r][c] = "ship";
    });

    // Store ship reference on the grid for lookup during attacks
    cells.forEach(([r, c]) => {
      this.grid[r][c] = ship; // store the actual ship object
    });
  }

  receiveAttack([row, col]) {
    const key = `${row},${col}`;
    if (this.attackedCells.has(key)) throw new Error("Already attacked here");

    this.attackedCells.add(key);
    const cell = this.grid[row][col];

    if (cell instanceof Ship) {
      cell.hit();
      this.grid[row][col] = "hit";
    } else {
      this.grid[row][col] = "miss";
      this.missedAttacks.push([row, col]);
    }
  }

  allSunk() {
    return this.ships.every(({ ship }) => ship.isSunk());
  }

  // Helper for tests: normalize cell display
  getCell([row, col]) {
    const cell = this.grid[row][col];
    if (cell === null) return null;
    if (cell === "hit" || cell === "miss") return cell;
    if (cell instanceof Ship) return "ship";
  }

  // Add inside the Gameboard class
    getShipAt([row, col]) {
        return this.ships.find(({ cells }) =>
            cells.some(([r, c]) => r === row && c === col)
        ) ?? null;
    }
}