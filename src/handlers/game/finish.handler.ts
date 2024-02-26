import { getResponse } from "../../utils";
import {  MessageType } from "../../enums";
import { Player } from "../../models";

const handler = (id: number, winner: Player, loser: Player) => {
  const data = {
    winPlayer: winner.id,
  }
  const response = getResponse(id, data, MessageType.FINISH);

  winner.socket!.send(response);

  if (loser.socket) {
    loser.socket.send(response);
  }

  loser.hits = [];
  loser.ships = [];

  winner.hits = [];
  winner.ships = [];
  winner.wins++;

  return response;
}

export default handler;
