import { AuthenticationRepository } from '../common_ports/database/authentication-repository.ts'
import { UserRepository } from '../common_ports/database/user-repository.ts'
import {
  AuthenticateUser,
  AuthenticationRequest,
  AuthenticationResponse,
} from './ports/authenticate-user.ts'
import { Failure } from './ports/authenticate-user.ts'

export class AuthenticateUserUseCase implements AuthenticateUser {
  constructor(private ports: AuthenticateUserPorts) {}

  async invoke(
    request: AuthenticationRequest,
    _response: AuthenticationResponse
  ): Promise<void> {
    const user = await this.ports.userRepository.findById(request.userId)
    if (!user) {
      _response.failure = Failure.USER_NOT_FOUND
      return Promise.resolve()
    }
    if (!(user.password === request.password)) {
      _response.failure = Failure.PASSWORD_INVALID
      return Promise.resolve()
    }
    const authentication =
      await this.ports.authenticationRepository.authenticate(user.id)
    _response.authentication = authentication
  }
}

export interface AuthenticateUserPorts {
  userRepository: UserRepository
  authenticationRepository: AuthenticationRepository
}
