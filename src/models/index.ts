import { RoomType } from '../enums';
import WebSocket from 'ws';

export interface Player {
  id: number;
  name: string;
  password: string;
  socket: WebSocket;
  wins: number;
  ships?: Ship[];
  hits: Hit[];
}

export interface Room {
  id: number;
  players: Player[];
  turn: number;
  type: RoomType;
}

export interface Ship {
  position: Hit,
  direction: boolean,
  length: number,
  type: RoomType,
  hits: number,
}

export interface Hit {
  x: number,
  y: number,
}

export type PlayerFields = Omit<Player, 'id' | 'wins' | 'hits'>;

