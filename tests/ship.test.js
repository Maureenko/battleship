import Ship from "../src/Ship.js";

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3); // length of 3
  });

  test("has the correct length", () => {
    expect(ship.length).toBe(3);
  });

  test("starts with 0 hits", () => {
    expect(ship.hits).toBe(0);
  });

  test("hit() increases hits by 1", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test("isSunk() returns false when not enough hits", () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("isSunk() returns true when hits equal length", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});