import { Authentication } from '../../../domain/value_objects/authentication.ts'

export interface AuthenticateUser {
  invoke(
    request: AuthenticationRequest,
    response: AuthenticationResponse
  ): Promise<void>
}

export interface AuthenticationRequest {
  userId: string
  password: string
}

export interface AuthenticationResponse {
  authentication: Authentication
  failure: Failure
}

export enum Failure {
  USER_NOT_FOUND = 'USER_NOT_FOUND ',
  PASSWORD_INVALID = 'PASSWORD_INVALID',
}
