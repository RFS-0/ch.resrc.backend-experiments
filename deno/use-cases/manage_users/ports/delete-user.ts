export interface DeleteUser {
  invoke(
    request: DeleteUserRequest,
    _response: DeleteUserResponse
  ): Promise<void>
}

export interface DeleteUserRequest {
  id: string
}

export interface DeleteUserResponse {
  failure: Failure | undefined
}

export enum Failure {
  USER_NOT_FOUND = 'USER_NOT_FOUND ',
}
