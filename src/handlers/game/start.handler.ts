import { getResponse } from "../../utils";
import { Room } from "../../models";
import { LogMessage, MessageType } from "../../enums";

const handler = (id: number, room: Room) => {
  const players = room.players;

  const currentPlayer =
    room.players[Math.trunc(Math.random() * players.length)]?.id || 0;

  room.turn = currentPlayer;

  for (const player of players) {
    const startGameData = {
      ships: player.ships,
      currentPlayerIndex: player.id,
    };
    const startGameResponse = getResponse(id, startGameData, MessageType.START_GAME);

    const turnData = {
      currentPlayer,
    }
    const turnResponse = getResponse(id, turnData, MessageType.TURN);

    player.socket.send(startGameResponse);
    console.log(LogMessage.MESSAGE_SENT, startGameResponse);

    player.socket.send(turnResponse);
    console.log(LogMessage.MESSAGE_SENT, turnResponse);
  }
}

export default handler;
