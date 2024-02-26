import { RoomType } from '../enums';
import WebSocket from 'ws';

export interface Player {
  id: number;
  name: string;
  password: string;
  socket: WebSocket;
  wins: number;
  ships?: Ship[];
}

export interface Room {
  id: number;
  players: Player[];
  turn: number;
  type: RoomType;
}

export interface Ship {
  position: {
    x: number,
    y: number,
  },
  direction: boolean,
  length: number,
  type: RoomType,
  hits: number,
}

export type PlayerFields = Omit<Player, 'id' | 'wins'>;

