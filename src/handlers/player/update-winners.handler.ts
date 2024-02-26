import { getResponse } from "../../utils";
import { playerService } from "../../services/player.service";
import { MessageType } from "../../enums";

const handler = (id: number) => {
  const winners = playerService
    .getPlayers()
    .map(({ name, wins }) => ({
      name,
      wins,
    }))
  
  const response = getResponse(id, winners, MessageType.UPDATE_WINNERS);

  return { response };
}

export default handler;
