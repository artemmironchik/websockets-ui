import { ErrorMessage, LogMessage } from "../enums";
import { httpServer } from "../http_server";
import { WebSocketServer } from "ws";

export const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on('connection', ws => {
  console.log(LogMessage.PLAYER_CONNECTED);

  ws.on('message', (data) => {
    try {
      const parsedData = JSON.parse(data.toString());

      console.log(LogMessage.MESSAGE_RECEIVE, parsedData);
    } catch {
      console.error(ErrorMessage.MESSAGE_PARSE_FAILED);
    }
  });

  ws.on('close', () => LogMessage.PLAYER_DISCONNECTED);
});