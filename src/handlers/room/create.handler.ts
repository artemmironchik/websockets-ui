import { WebSocket } from "ws";

import { roomService } from "../../services/room.service";
import { RoomType } from "../../enums";
import { playerService } from "../../services/player.service";

const handler = (socket: WebSocket, type: RoomType = RoomType.MULTI) => {
  const room = roomService.createRoom(type);
  const player = playerService.getPlayerBySocket(socket);

  if (player) {
    roomService.addPlayerToTheRoom(room.id, player);
  }
}

export default handler;
