import { isDeepStrictEqual } from "util";

import { AttackStatus } from "../enums";
import { Hit, Player, Room, Ship } from "../models";

export const isFieldHit = (position: Hit, player: Player) => {
  return player.hits.find((hit) => hit.x === position.x && hit.y === position.y);
}

export const markAsHit = (position: Hit, player: Player) => {
  return player.hits.push(position);
}

export const isShipHit = (position: Hit, player: Player) => {
  const { x, y } = position;

  return player.ships?.find((ship) => {
    if (ship.direction) {
      return ship.position.x === x
              && y >= ship.position.y
              && y < ship.position.y + ship.length
    } else {
      return ship.position.y === y
              && x >= ship.position.x
              && x < ship.position.x + ship.length
    }
  })
}

export const markSurroundingFields = (ship: Ship, player: Player) => {
  const { position, direction, length } = ship;
  const { x: shipX, y: shipY } = position;

  const startX = Math.max(shipX - 1, 0);
  const endX = direction ? Math.min(shipX + 1, 10) : Math.min(shipX + length, 10);

  const startY = Math.max(shipY - 1, 0);
  const endY = direction ? Math.min(shipY + length, 10) : Math.min(shipY + 1, 10);

  const fields = [];

  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      const newPos = { x, y };

      if (!isFieldHit(newPos, player)) {
        markAsHit(newPos, player);

        fields.push(newPos);
      }
    }
  }

  return fields;
}

export const attackFunc = (position: Hit, enemy: Player, room: Room) => {
  markAsHit(position, enemy);

  let status = AttackStatus.MISS;
  let fields;

  const hitShip = isShipHit(position, enemy);

  if (hitShip) {
    let { hits, length } = hitShip;

    hits++;

    if (hits === length) {
      status = AttackStatus.KILLED;

      enemy.ships = enemy.ships?.filter((ship) => !isDeepStrictEqual(ship, hitShip));

      if (!enemy.ships?.length) {
        return { isFinish: true };
      }

      fields = markSurroundingFields(hitShip, enemy);
    } else {
      status = AttackStatus.SHOT;
    }
  } else {
    room.turn = enemy.id;
  }

  return { status, fields };
}