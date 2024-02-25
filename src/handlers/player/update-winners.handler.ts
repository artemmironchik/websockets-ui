import { getUpdateWinnersResponse } from "../../utils";
import { playerService } from "../../services/player.service";

const handler = (id: number) => {
  const winners = playerService
    .getPlayers()
    .map(({ name, wins }) => ({
      name,
      wins,
    }))
  
  const response = getUpdateWinnersResponse(id, winners);

  return { response };
}

export default handler;
