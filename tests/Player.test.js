// tests/Player.test.js
import Player from "../src/Player.js";

describe("Player", () => {
  test("has its own gameboard", () => {
    const player = new Player("human");
    expect(player.gameboard).toBeDefined();
  });

  test("computer makes a legal random attack", () => {
    const human = new Player("human");
    const computer = new Player("computer");

    const coord = computer.getComputerAttack();
    expect(coord).toHaveLength(2);
    expect(coord[0]).toBeGreaterThanOrEqual(0);
    expect(coord[0]).toBeLessThan(10);
  });

  test("computer never attacks the same cell twice", () => {
    const computer = new Player("computer");
    const attacked = new Set();

    // Simulate 20 attacks — none should repeat
    for (let i = 0; i < 20; i++) {
      const [r, c] = computer.getComputerAttack();
      const key = `${r},${c}`;
      expect(attacked.has(key)).toBe(false);
      attacked.add(key);
      computer.recordAttack([r, c]); // tell the computer it used this cell
    }
  });
});