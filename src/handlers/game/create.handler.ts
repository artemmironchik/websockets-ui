import { getCreateGameResponse } from "../../utils";
import { Room } from "../../models";
import { LogMessage } from "../../enums";

const handler = (id: number, room: Room) => {
  const players = room.players;

  for (const player of players) {
    const data = {
      idGame: room.id,
      idPlayer: player.id,
    };
    const response = getCreateGameResponse(id, data);

    player.socket.send(response);
    console.log(LogMessage.MESSAGE_SENT, response);
  }
}

export default handler;
