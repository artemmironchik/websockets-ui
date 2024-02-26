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

export const getResponse = (id: number, data: any, type: MessageType) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id,
  });
}
