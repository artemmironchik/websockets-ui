import { WebSocket } from "ws";

import { roomService } from "../../services/room.service";
import { ErrorMessage, RoomType } from "../../enums";
import { playerService } from "../../services/player.service";
import { getErrorResponse } from "../../utils";

const handler = (id: number, socket: WebSocket, type: RoomType = RoomType.MULTI) => {
  const room = roomService.createRoom(type);
  const player = playerService.getPlayerBySocket(socket);

  if (player) {
    roomService.addPlayerToTheRoom(room.id, player);
  } else {
    const response =
      getErrorResponse(id, ErrorMessage.NO_PLAYER_FOUND);

    return { response };
  }
}

export default handler;
