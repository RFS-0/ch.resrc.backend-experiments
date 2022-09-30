import { User } from '../../../domain/entities/user.ts'

export interface FindUserByUsername {
  invoke(request: FindUserRequest, _response: FindUserResponse): Promise<void>
}

export interface FindUserRequest {
  username: string
}

export interface FindUserResponse {
  user: User
  failure: Failure | undefined
}

export enum Failure {
  USER_NOT_FOUND = 'USER_NOT_FOUND ',
}
