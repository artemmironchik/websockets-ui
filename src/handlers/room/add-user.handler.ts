import { WebSocket } from "ws";
import { isDeepStrictEqual } from "util";

import { getErrorResponse } from "../../utils";
import { ErrorMessage } from "../../enums";
import { roomService } from "../../services/room.service";
import { playerService } from "../../services/player.service";

const handler = (id: number, data: any, socket: WebSocket) => {
  const { indexRoom } = JSON.parse(data);

  if (indexRoom === undefined) {
    const response =
      getErrorResponse(id, ErrorMessage.INVALID_PARAMS);

    return { response };
  }

  const room = roomService.getRoom(indexRoom);

  if (!room) {
    const response =
      getErrorResponse(id, ErrorMessage.NO_ROOM_FOUND);

    return { response };
  }

  const player = playerService.getPlayerBySocket(socket);

  if (room.players.find((roomPlayer) => isDeepStrictEqual(roomPlayer, player))) {
    const response =
      getErrorResponse(id, ErrorMessage.CANT_JOIN_YOUR_ROOM);

    return { response };
  }

  if (player) {
    roomService.addPlayerToTheRoom(id, player);

    return { room };
  } else {
    const response =
      getErrorResponse(id, ErrorMessage.NO_PLAYER_FOUND);

    return { response };
  }
}

export default handler;