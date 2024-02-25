import { Player, Room } from "../models";
import { rooms } from "../database/db";
import { RoomType } from "../enums";

const getRooms = (): Room[] => rooms;

const getRoom = (id: number): Room | undefined => {
  return rooms.find((room) => room.id === id);
}

const createRoom = (type: RoomType): Room => {
  const rooms = getRooms();

  const newRoom = {
    id: rooms.length,
    players: [],
    turn: 0,
    type,
  };

  rooms.push(newRoom);

  return newRoom;
}

const addPlayerToTheRoom = (id: number, player: Player): void => {
  const room = getRoom(id);

  if (room) {
    room.players.push(player);
  }
}

export const roomService = {
  addPlayerToTheRoom,
  createRoom,
  getRoom,
  getRooms,
}
