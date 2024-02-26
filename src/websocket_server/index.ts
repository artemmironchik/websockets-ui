import { WebSocketServer } from "ws";

import register from '../handlers/player/registration.handler';
import updateRoom from '../handlers/room/update.handler';
import updateWinners from '../handlers/player/update-winners.handler';
import createRoom from '../handlers/room/create.handler';
import addUserToRoom from '../handlers/room/add-user.handler';
import createGame from '../handlers/game/create.handler';
import addShips from '../handlers/game/add-ships.handler';
import attackHandler from '../handlers/attack/attack.handler';
import randomAttackHandler from '../handlers/attack/random.handler';
import gameFinish from '../handlers/game/finish.handler';
import { getErrorResponse } from "../utils";
import { ErrorMessage, LogMessage, MessageType, RoomType } from "../enums";
import { httpServer } from "../http_server";
import { playerService } from "../services/player.service";
import { roomService } from "../services/room.service";

export const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on('connection', (ws) => {
  console.log(LogMessage.PLAYER_CONNECTED);

  ws.on('message', (message) => {
    try {
      const parsedData = JSON.parse(message.toString());

      const { type, data, id } = parsedData;

      console.log(LogMessage.MESSAGE_RECEIVE, parsedData);

      switch (type) {
        case MessageType.REG:
          const { response: regResponse, player } = register(id, data, ws);

          ws.send(regResponse);
          console.log(LogMessage.MESSAGE_SENT, regResponse);

          if (player) {
            const { response: updateRoomResponse } = updateRoom(id);

            sendResponseToAllActive(updateRoomResponse);
            console.log(LogMessage.MESSAGE_SENT, updateRoomResponse);

            const { response: updateWinnersResponse } = updateWinners(id);

            sendResponseToAllActive(updateWinnersResponse);
            console.log(LogMessage.MESSAGE_SENT, updateWinnersResponse);
          }

          break;
        case MessageType.CREATE_ROOM:
          const createRoomResponse = createRoom(id, ws);

          if (createRoomResponse.response) {
            ws.send(createRoomResponse.response);
            console.log(LogMessage.MESSAGE_SENT, createRoomResponse.response);
          } else {
            const { response: updateRoomResponse } = updateRoom(id);
  
            sendResponseToAllActive(updateRoomResponse);
            console.log(LogMessage.MESSAGE_SENT, updateRoomResponse);
          }

          break;
        case MessageType.ADD_USER_TO_ROOM:
          const { room, response: addUserResponse } = addUserToRoom(id, data, ws);

          if (room) {
            const { response: updateRoomAfterAddUserResponse } = updateRoom(id);
  
            sendResponseToAllActive(updateRoomAfterAddUserResponse);
            console.log(LogMessage.MESSAGE_SENT, updateRoomAfterAddUserResponse);

            createGame(id, room);
          } else {
            ws.send(addUserResponse);
            console.log(LogMessage.MESSAGE_SENT, addUserResponse);
          }

          break;
        case MessageType.ADD_SHIPS:
          const addShipsResponse = addShips(id, data);

          if (addShipsResponse) {
            ws.send(addShipsResponse.response);
            console.log(LogMessage.MESSAGE_SENT, addShipsResponse.response);
          }

          break;
        case MessageType.ATTACK:
          const attackResponse = attackHandler(id, data);

          if (attackResponse?.error) {
            ws.send(attackResponse.error);
            console.log(LogMessage.MESSAGE_SENT, attackResponse.error);
          } else if (attackResponse?.finish) {
            console.log(attackResponse.finish);

            const { response: updateWinnersAttackResponse } = updateWinners(id);

            sendResponseToAllActive(updateWinnersAttackResponse);
            console.log(LogMessage.MESSAGE_SENT, updateWinnersAttackResponse);
          }

          break;
        case MessageType.RANDOM_ATTACK:
          const randomAttackResponse = randomAttackHandler(id, data);

          if (randomAttackResponse?.error) {
            ws.send(randomAttackResponse.error);
            console.log(LogMessage.MESSAGE_SENT, randomAttackResponse.error);
          } else if (randomAttackResponse?.finish) {
            console.log(LogMessage.MESSAGE_SENT, randomAttackResponse.finish);

            const { response: updateWinnersRandomAttackResponse } = updateWinners(id);

            sendResponseToAllActive(updateWinnersRandomAttackResponse);
            console.log(LogMessage.MESSAGE_SENT, updateWinnersRandomAttackResponse);
          }

          break;
        case MessageType.SINGLE_PLAY:
          const createSingleRoomResponse = createRoom(id, ws, RoomType.SINGLE);

          if (createSingleRoomResponse?.response) {
            ws.send(createSingleRoomResponse.response);
            console.log(LogMessage.MESSAGE_SENT, createSingleRoomResponse.response);
          } else if (createSingleRoomResponse?.room) {
            createGame(id, createSingleRoomResponse.room);
          }

          break;
        default:
          ws.send(getErrorResponse(id, `${ErrorMessage.INVALID_MESSAGE_TYPE}: ${type}`));
          console.log(LogMessage.MESSAGE_SENT, `${ErrorMessage.INVALID_MESSAGE_TYPE}: ${type}`);

          break;
      }
    } catch {
      console.error(ErrorMessage.PARSE_FAILED);
    }
  });

  ws.on('close', () => {
    const player = playerService.getPlayerBySocket(ws);

    if (player) {
      const room = roomService.getRoomByPlayerId(player.id);

      if (room) {
        if (room.type === RoomType.SINGLE) {
          roomService.removeRoom(room.id);

          playerService.removeBot(player.id);
        } else {
          const otherPlayer = room.players.find((roomPlayer) => player.id !== roomPlayer.id)!;

          const response = gameFinish(0, otherPlayer, player, room.id);

          player.socket!.send(response);
          otherPlayer.socket!.send(response);
        }
      }

      playerService.removePlayer(player.id);

      const { response: updateRoomResponse } = updateRoom(0);
  
      sendResponseToAllActive(updateRoomResponse);
      console.log(LogMessage.MESSAGE_SENT, updateRoomResponse);

      const { response: updateWinnersResponse } = updateWinners(0);

      sendResponseToAllActive(updateWinnersResponse);
      console.log(LogMessage.MESSAGE_SENT, updateWinnersResponse);
    }
    
    console.log(LogMessage.PLAYER_DISCONNECTED);
  });
})

const sendResponseToAllActive = (response: any) => {
  wsServer.clients.forEach((client) => {
    const player = playerService.getPlayerBySocket(client);

    if (client.OPEN && player) {
      client.send(response);
    }
  })
}
