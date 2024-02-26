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
    hits: [],
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

const getPlayerById = (id: number): Player | undefined => {
  return players.find((player) => player.id === id);
}

const createBot = (id: number): Player => {
  const newPlayer = {
    id: -(id + 1),
    name: `Bot ${id}`,
    password: '',
    wins: 0,
    hits: [],
  };

  players.push(newPlayer);

  return newPlayer;
}

export const playerService = {
  createBot,
  createPlayer,
  getPlayerById,
  getPlayerByName,
  getPlayerBySocket,
  getPlayers,
}
