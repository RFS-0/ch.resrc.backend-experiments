import { AuthenticationRepository } from '../common_ports/database/authentication-repository.ts'
import {
  Failure,
  RevokeAuthentication,
  RevokeAuthenticationRequest,
  RevokeAuthenticationResponse,
} from './ports/revoke-authentication.ts'

export class RevokeAuthenticationUseCase implements RevokeAuthentication {
  constructor(private ports: RevokeAuthenticationPorts) {}

  invoke(
    request: RevokeAuthenticationRequest,
    _response: RevokeAuthenticationResponse
  ): Promise<void> {
    if (!this.ports.authenticationRepository.isAuthenticated(request.token)) {
      _response.failure = Failure.USER_NOT_LOGGED_IN
      return Promise.resolve()
    }
    try {
    this.ports.authenticationRepository.revokeAuthentication(request.token)

    } catch (error) {
      console.log(error)
      _response.failure = Failure.DATABASE_ERROR
    }
    return Promise.resolve()
  }
}

export interface RevokeAuthenticationPorts {
  authenticationRepository: AuthenticationRepository
}
