import { MessageType } from "../enums";

export const getErrorResponse = (id: number, message: string) => {
  return JSON.stringify({
    type: MessageType.ERROR,
    data: JSON.stringify({
      message,
    }),
    id,
  });
}

export const getRegistrationResponse = (
  id: number,
  name: string,
  index: number,
  error: boolean,
  errorText: string = "",
) => {
  return JSON.stringify({
    type: MessageType.REG,
    data: JSON.stringify({
      name,
      index,
      error,
      errorText
    }),
    id,
  });
}

export const getUpdateRoomResponse = (id: number, data: any) => {
  return JSON.stringify({
    type: MessageType.UPDATE_ROOM,
    data: JSON.stringify(data),
    id,
  });
}

export const getUpdateWinnersResponse = (id: number, data: any) => {
  return JSON.stringify({
    type: MessageType.UPDATE_WINNERS,
    data: JSON.stringify(data),
    id,
  });
}
