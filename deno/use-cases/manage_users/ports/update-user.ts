import { UpdatedUser } from '../../../domain/value_objects/updated-user.ts'

export interface UpdateUser {
  invoke(
    request: UpdateUserRequest,
    _response: UpdateUserResponse
  ): Promise<void>
}

export interface UpdateUserRequest {
  id: string
  updatedUser: UpdatedUser
}

export interface UpdateUserResponse {
  failure: Failure | undefined
}

export enum Failure {
  COULD_NOT_UPDATE_USER = 'COULD_NOT_UPDATE_USER ',
}
