import { getUpdateRoomResponse } from "../../utils";
import { roomService } from "../../services/room.service";

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
  
  const response = getUpdateRoomResponse(id, availableRooms);

  return { response };
}

export default handler;
