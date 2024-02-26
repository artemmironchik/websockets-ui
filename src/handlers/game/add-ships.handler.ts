import startGame from './start.handler';
import { getErrorResponse } from "../../utils";
import { ErrorMessage, RoomType } from "../../enums";
import { roomService } from "../../services/room.service";
import { shipService } from '../../services/ship.service';
import { Ship } from "../../models";

const handler = (id: number, data: any) => {
  const { gameId, ships, indexPlayer } = JSON.parse(data);

  const room = roomService.getRoom(gameId);

  if (!room) {
    const response =
      getErrorResponse(id, ErrorMessage.NO_ROOM_FOUND);

    return { response };
  }

  const player = room.players.find((player) => player.id === indexPlayer);

  if (!player) {
    const response =
      getErrorResponse(id, ErrorMessage.NO_PLAYER_FOUND);

    return { response };
  }

  player.ships = ships.map((ship: Ship) => ({ ...ship, hits: 0 }));

  if (room.type === RoomType.SINGLE) {
    const bot = room.players.find((player) => player.id === indexPlayer);

    if (bot) {
      bot.ships = shipService.generateShips();
    }
  }

  const isGameReadyToStart =
    room.players.length === 2 &&
    room.players.every(({ ships }) => ships && ships.length);

  if (isGameReadyToStart || room.type === RoomType.SINGLE) {
    startGame(id, room);
  }

  return;
}

export default handler;
