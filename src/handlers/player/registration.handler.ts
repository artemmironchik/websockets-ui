import WebSocket from 'ws';

import { playerService } from "../../services/player.service";
import { getErrorResponse, getRegistrationResponse } from '../../utils';
import { ErrorMessage } from '../../enums';
import { PlayerFields } from '../../models';

const handler = (id: number, data: any, socket: WebSocket) => {
  let { name, password } = JSON.parse(data);

  name = name.trim();
  password = password.trim();

  if (!name || !password) {
    const response =
      getErrorResponse(id, ErrorMessage.INVALID_PARAMS);

    return { response };
  }

  const player = playerService.getPlayerByName(name);

  if (player) {
    const { id: playerId, password: playerPassword } = player;

    if (playerPassword !== password) {
      const response =
        getRegistrationResponse(id, name, playerId, true, ErrorMessage.PLAYER_EXISTS);

      return { response };
    }

    const response =
      getRegistrationResponse(id, name, playerId, false);

    return { response };
  }

  const newPlayerFields: PlayerFields = {
    name,
    password,
    socket,
  }

  const newPlayer = playerService.createPlayer(newPlayerFields);

  const response =
    getRegistrationResponse(id, name, newPlayer.id, false);

  return { response, player: newPlayer };
}

export default handler;
