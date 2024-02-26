export enum ErrorMessage {
  PARSE_FAILED = 'Failed to parse ws message',
  INVALID_MESSAGE_TYPE = 'Invalid message type',
  PLAYER_EXISTS = 'Player with this name already exists',
  INVALID_PARAMS = 'Invalid params',
  NO_ROOM_FOUND = 'No room found',
  NO_PLAYER_FOUND = 'No player found',
  NOT_PLAYER_TURN_TO_HIT = 'Not your turn to hit',
  FIELD_ALREADY_HIT = 'This field has already been hit',
  CANT_JOIN_YOUR_ROOM = "You can't join your room",
}
