import WebSocket from 'ws';
import { isDeepStrictEqual } from "util";

import { players } from "../database/db";
import { PlayerFields, Player } from "../models";

const getPlayers = (): Player[] => players;

const createPlayer = (fields: PlayerFields): Player => {
  const players = getPlayers();

  const newPlayer = {
    id: players.length,
    wins: 0,
    ...fields,
  };

  players.push(newPlayer);

  return newPlayer;
}

const getPlayerByName = (name: string): Player | undefined => {
  return players.find((player) => player.name === name);
}

const getPlayerBySocket = (socket: WebSocket): Player | undefined => {
  return players.find((player) => isDeepStrictEqual(player.socket, socket));
}

export const playerService = {
  createPlayer,
  getPlayerByName,
  getPlayerBySocket,
  getPlayers,
}
