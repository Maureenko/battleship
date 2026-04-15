// src/GameController.js
import Player from "./Player.js";

export default class GameController {
    constructor() {
        this.human = new Player("human");
        this.computer = new Player("computer");
        this.currentTurn = "human";
        this.gameOver = false;
        this.placementPhase = true;
        this.orientation = "horizontal";

        this.shipsToPlace = [
            { length: 5, name: "Carrier" },
            { length: 4, name: "Battleship" },
            { length: 3, name: "Destroyer" },
            { length: 3, name: "Submarine" },
            { length: 2, name: "Patrol Boat" },
        ];

        this.#placeComputerShips(); // unchanged
    }

    toggleOrientation() {
        this.orientation = this.orientation === "horizontal" ? "vertical" : "horizontal";
    }

  // Try to place the current ship at [row, col]. Returns true on success.
    placeHumanShip([row, col], length, orientation) {
        try {
            this.human.gameboard.placeShip(length, [row, col], orientation);

            // Count how many ships have been placed
            const placed = this.human.gameboard.ships.length;
            if (placed >= this.shipsToPlace.length) {
                this.placementPhase = false;
            }

            return true;
        } catch {
            return false;
        }
    }

  #placeComputerShips() {
    const ships = [5, 4, 3, 3, 2];
    for (const length of ships) {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const dir = Math.random() < 0.5 ? "horizontal" : "vertical";
        try {
          this.computer.gameboard.placeShip(length, [row, col], dir);
          placed = true;
        } catch {
          // Overlap or out of bounds — try again
        }
      }
    }
  }

  humanAttack([row, col]) {
    if (this.gameOver || this.currentTurn !== "human" || this.placementPhase) return;

    this.computer.gameboard.receiveAttack([row, col]);

    if (this.computer.gameboard.allSunk()) {
      this.gameOver = true;
      return { winner: "human" };
    }

    this.currentTurn = "computer";
    return this.#computerTurn();
  }

  #computerTurn() {
    const coord = this.computer.getComputerAttack();
    this.computer.recordAttack(coord);
    this.human.gameboard.receiveAttack(coord);

    if (this.human.gameboard.allSunk()) {
      this.gameOver = true;
      return { winner: "computer" };
    }

    this.currentTurn = "human";
    return { winner: null };
  }
}