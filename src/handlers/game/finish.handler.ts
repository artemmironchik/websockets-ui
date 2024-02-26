import { getResponse } from "../../utils";
import {  MessageType } from "../../enums";
import { Player } from "../../models";
import { roomService } from "../../services/room.service";

const handler = (id: number, winner: Player, loser: Player, roomId: number) => {
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

  roomService.removeRoom(roomId);

  return response;
}

export default handler;
