import { getResponse } from "../../utils";
import { Room } from "../../models";
import { LogMessage, MessageType } from "../../enums";

const handler = (id: number, room: Room) => {
  const players = room.players;

  for (const player of players) {
    const data = {
      idGame: room.id,
      idPlayer: player.id,
    };
    const response = getResponse(id, data, MessageType.CREATE_GAME);

    player.socket!.send(response);
    console.log(LogMessage.MESSAGE_SENT, response);
  }
}

export default handler;
