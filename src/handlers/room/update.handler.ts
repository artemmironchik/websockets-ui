import { getResponse } from "../../utils";
import { roomService } from "../../services/room.service";
import { MessageType } from "../../enums";

const handler = (id: number) => {
  const availableRooms = roomService
    .getRooms()
    .filter(({ players }) => players.length === 1)
    .map(({ id, players }) => ({
      roomId: id,
      roomUsers: players.map(({ name, id }) => ({
        name,
        index: id,
      }))
    }))
  
  const response = getResponse(id, availableRooms, MessageType.UPDATE_ROOM);

  return { response };
}

export default handler;
