import { rooms } from "../database/db";

const getRooms = () => rooms;

export const roomService = {
  getRooms,
}
