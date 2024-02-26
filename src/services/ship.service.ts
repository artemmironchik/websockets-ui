import { ShipType } from "../enums/ship-type.enum";
import { Ship } from "../models";

const generateShips = () => {
  const fieldSize = 10;
  const shipTypes = [
    { type: ShipType.HUGE, length: 4 },
    { type: ShipType.LARGE, length: 3 },
    { type: ShipType.MEDIUM, length: 2 },
    { type: ShipType.SMALL, length: 1 },
  ];

  let ships = [];

  const isPositionValid = (x: number, y: number, direction: boolean, length: number) => {
    if (direction) {
      return y + length <= fieldSize;
    } else {
      return x + length <= fieldSize;
    }
  };

  const isPositionFree = (x: number, y: number, direction: boolean, length: number, ships: Ship[]) => {
    for (let i = 0; i < length; i++) {
      if (direction) {
        if (ships.find(ship => ship.position.x === x && ship.position.y === y + i)) {
          return false;
        }
      } else {
        if (ships.find(ship => ship.position.x === x + i && ship.position.y === y)) {
          return false;
        }
      }
    }

    return true;
  };

  const getRandomPosition = () => {
    return { x: Math.floor(Math.random() * fieldSize), y: Math.floor(Math.random() * fieldSize) };
  };

  const getRandomDirection = () => {
    return Math.random() < 0.5;
  };

  for (const shipType of shipTypes) {
    let shipAdded = false;

    while (!shipAdded) {
      const position = getRandomPosition();
      const direction = getRandomDirection();

      if (isPositionValid(position.x, position.y, direction, shipType.length) &&
        isPositionFree(position.x, position.y, direction, shipType.length, ships)) {
        ships.push({
          position: position,
          direction: direction,
          type: shipType.type,
          length: shipType.length,
          hits: 0,
        });

        shipAdded = true;
      }
    }
  }

  return ships;
}

export const shipService = {
  generateShips,
}
