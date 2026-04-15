import Gameboard from "../src/Gameboard.js";

describe("Gameboard", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  // --- placeShip ---
  test("places a ship horizontally", () => {
    board.placeShip(3, [0, 0], "horizontal");
    expect(board.getCell([0, 0])).toBe("ship");
    expect(board.getCell([0, 1])).toBe("ship");
    expect(board.getCell([0, 2])).toBe("ship");
    expect(board.getCell([0, 3])).toBeNull();
  });

  test("places a ship vertically", () => {
    board.placeShip(3, [0, 0], "vertical");
    expect(board.getCell([0, 0])).toBe("ship");
    expect(board.getCell([1, 0])).toBe("ship");
    expect(board.getCell([2, 0])).toBe("ship");
  });

  test("throws if ship is placed out of bounds", () => {
    expect(() => board.placeShip(3, [0, 9], "horizontal")).toThrow();
  });

  test("throws if ship overlaps another ship", () => {
    board.placeShip(3, [0, 0], "horizontal");
    expect(() => board.placeShip(2, [0, 1], "vertical")).toThrow();
  });

  // --- receiveAttack ---
  test("records a miss", () => {
    board.placeShip(2, [0, 0], "horizontal");
    board.receiveAttack([5, 5]);
    expect(board.missedAttacks).toContainEqual([5, 5]);
  });

  test("hitting a ship calls ship.hit()", () => {
    board.placeShip(2, [0, 0], "horizontal");
    board.receiveAttack([0, 0]);
    expect(board.missedAttacks).not.toContainEqual([0, 0]);
    expect(board.getCell([0, 0])).toBe("hit");
  });

  test("throws if the same coordinate is attacked twice", () => {
    board.receiveAttack([3, 3]);
    expect(() => board.receiveAttack([3, 3])).toThrow();
  });

  // --- allSunk ---
  test("allSunk() returns false when ships remain", () => {
    board.placeShip(1, [0, 0], "horizontal");
    expect(board.allSunk()).toBe(false);
  });

  test("allSunk() returns true when all ships are sunk", () => {
    board.placeShip(1, [0, 0], "horizontal");
    board.receiveAttack([0, 0]);
    expect(board.allSunk()).toBe(true);
  });
});