import startGame from './start.handler';
import { getErrorResponse } from "../../utils";
import { ErrorMessage } from "../../enums";
import { roomService } from "../../services/room.service";
import { Ship } from "../../models";

const handler = (id: number, data: any) => {
  const { gameId, ships, indexPlayer } = JSON.parse(data);

  const room = roomService.getRoom(gameId);

  if (!room) {
    const response =
      getErrorResponse(id, ErrorMessage.NO_ROOM_FOUND);

    return { response };
  }

  const player = room.players[indexPlayer];

  if (!player) {
    const response =
      getErrorResponse(id, ErrorMessage.NO_PLAYER_FOUND);

    return { response };
  }

  player.ships = ships.map((ship: Ship) => ({ ...ship, hits: 0 }));

  const isGameReadyToStart =
    room.players.length === 2 &&
    room.players.every(({ ships }) => ships && ships.length);

  if (isGameReadyToStart) {
    startGame(id, room);
  }

  return;
}

export default handler;
