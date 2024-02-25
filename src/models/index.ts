import WebSocket from 'ws';

export interface Player {
  id: number;
  name: string;
  password: string;
  socket: WebSocket;
  wins: number;
}

export interface Room {
  id: number;
  players: Player[];
  turn: number;
}

export type PlayerFields = Omit<Player, 'id' | 'wins'>;

