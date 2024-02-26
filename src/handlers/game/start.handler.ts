import { getResponse } from "../../utils";
import { Room } from "../../models";
import { LogMessage, MessageType, RoomType } from "../../enums";

const handler = (id: number, room: Room) => {
  const players = room.players;

  const currentPlayer = room.type === RoomType.SINGLE
    ? room.players[0]!.id
    : room.players[Math.trunc(Math.random() * players.length)]?.id;

  room.turn = currentPlayer || 0;

  for (const player of players) {
    const startGameData = {
      ships: player.ships,
      currentPlayerIndex: currentPlayer,
    };
    const startGameResponse = getResponse(id, startGameData, MessageType.START_GAME);

    const turnData = {
      currentPlayer,
    }
    const turnResponse = getResponse(id, turnData, MessageType.TURN);

    player.socket!.send(startGameResponse);
    console.log(LogMessage.MESSAGE_SENT, startGameResponse);

    player.socket!.send(turnResponse);
    console.log(LogMessage.MESSAGE_SENT, turnResponse);
  }
}

export default handler;
