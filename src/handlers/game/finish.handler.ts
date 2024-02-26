import { getResponse } from "../../utils";
import { Player } from "../../models";
import { MessageType } from "../../enums";

const handler = (id: number, winner: Player, loser: Player) => {
  const data = {
    winPlayer: winner.id,
  }
  const response = getResponse(id, data, MessageType.FINISH);

  winner.socket.send(response);
  loser.socket.send(response);

  loser.hits = [];
  loser.ships = [];

  winner.hits = [];
  winner.ships = [];
  winner.wins++;

  return response;
}

export default handler;
