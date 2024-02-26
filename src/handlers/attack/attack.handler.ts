import gameFinish from '../game/finish.handler';
import { attackFunc, getErrorResponse, getResponse, isFieldHit } from "../../utils";
import { AttackStatus, ErrorMessage, LogMessage, MessageType } from "../../enums";
import { roomService } from "../../services/room.service";

const handler = (id: number, data: any) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data);

  const room = roomService.getRoom(gameId);

  if (!room) {
    const response =
      getErrorResponse(id, ErrorMessage.NO_ROOM_FOUND);

    return { error: response };
  }

  const player = room.players[indexPlayer];

  if (!player) {
    const response =
      getErrorResponse(id, ErrorMessage.NO_PLAYER_FOUND);

    return { error: response };
  }

  if (room.turn !== indexPlayer) {
    const response =
      getErrorResponse(id, ErrorMessage.NOT_PLAYER_TURN_TO_HIT);

    return { error: response };
  }

  const enemy = room.players.find((player) => player.id !== indexPlayer);

  if (!enemy) {
    const response =
      getErrorResponse(id, ErrorMessage.NO_PLAYER_FOUND);

    return { error: response };
  }

  if (isFieldHit({ x, y }, enemy)) {
    const response =
      getErrorResponse(id, ErrorMessage.FIELD_ALREADY_HIT);

    return { error: response };
  }

  const attackUtilResponse = attackFunc({ x, y }, enemy, room);

  if (attackUtilResponse.isFinish) {
    const gameFinishResponse = gameFinish(id, player, enemy);

    return { finish: gameFinishResponse };
  } else if (attackUtilResponse.status) {
    const currentPlayer = room.turn;

    const attackData = {
      position: {
        x,
        y,
      },
      currentPlayer,
      status: attackUtilResponse.status,
    };
    const turnResponse = getResponse(id, { currentPlayer }, MessageType.TURN);
    const attackResponse = getResponse(id, attackData, MessageType.ATTACK);

    player.socket.send(attackResponse);
    enemy.socket.send(attackResponse);

    console.log(LogMessage.MESSAGE_SENT, attackResponse);

    if (attackUtilResponse.fields) {
      attackUtilResponse.fields.forEach((field) => {
        const attackData = {
          position: {
            x: field.x,
            y: field.y,
          },
          currentPlayer,
          status: AttackStatus.MISS,
        };
        const attackResponse = getResponse(id, attackData, MessageType.ATTACK);

        player.socket.send(attackResponse);
        enemy.socket.send(attackResponse);

        console.log(LogMessage.MESSAGE_SENT, attackResponse);
      })
    }

    player.socket.send(turnResponse);
    enemy.socket.send(turnResponse);

    console.log(LogMessage.MESSAGE_SENT, turnResponse);
  }
}

export default handler;
