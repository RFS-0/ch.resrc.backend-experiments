import { IntendedUser } from '../../../domain/value_objects/intended-user.ts'
import { User } from '../../../domain/entities/user.ts'

export interface CreateUsers {
  invoke(
    request: CreateUsersRequest,
    _response: CreateUsersResponse
  ): Promise<void>
}

export interface CreateUsersRequest {
  users: IntendedUser[]
}

export interface CreateUsersResponse {
  users: User[]
  failure: Failure | undefined
}

export enum Failure {
  COULD_NOT_CREATE_USER = 'COULD_NOT_CREATE_USER ',
}
