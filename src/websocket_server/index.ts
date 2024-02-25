import { WebSocketServer } from "ws";

import register from '../handlers/player/registration.handler';
import updateRoom from '../handlers/room/update.handler';
import updateWinners from '../handlers/player/update-winners.handler';
import { getErrorResponse } from "../utils";
import { ErrorMessage, LogMessage, MessageType } from "../enums";
import { httpServer } from "../http_server";
import { playerService } from "../services/player.service";

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
          break;
        case MessageType.ADD_USER_TO_ROOM:
          break;
        case MessageType.ADD_SHIPS:
          break;
        case MessageType.ATTACK:
          break;
        case MessageType.RANDOM_ATTACK:
          break;
        default:
          ws.send(getErrorResponse(id, `${ErrorMessage.INVALID_MESSAGE_TYPE}: ${type}`));

          break;
      }
    } catch {
      console.error(ErrorMessage.PARSE_FAILED);
    }
  });

  ws.on('close', () => console.log(LogMessage.PLAYER_DISCONNECTED));
})

const sendResponseToAllActive = (response: any) => {
  wsServer.clients.forEach((client) => {
    const player = playerService.getPlayerBySocket(client);

    if (client.OPEN && player) {
      client.send(response);
    }
  })
}