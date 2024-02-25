import "dotenv/config";
import { httpServer } from './src/http_server';
import { wsServer } from "./src/websocket_server";

const HTTP_PORT = process.env.PORT;

wsServer.options.server = httpServer;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});
