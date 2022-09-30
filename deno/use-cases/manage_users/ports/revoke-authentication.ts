export interface RevokeAuthentication {
  invoke(
    request: RevokeAuthenticationRequest,
    _response: RevokeAuthenticationResponse
  ): Promise<void>
}

export interface RevokeAuthenticationRequest {
  token: string
}

export interface RevokeAuthenticationResponse {
  failure: Failure | undefined
}

export enum Failure {
  USER_NOT_LOGGED_IN = 'USER_NOT_LOGGED_IN ',
  INVALID_TOKEN = 'INVALID_TOKEN',
  DATABASE_ERROR = 'DATABASE_ERROR',
}
