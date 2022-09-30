import { UserRepository } from '../common_ports/database/user-repository.ts'
import {
  Failure,
  FindUserByUsername,
  FindUserRequest,
  FindUserResponse,
} from './ports/find-user-by-username.ts'

export class FindUserByUsernameUseCase implements FindUserByUsername {
  constructor(private ports: FindUserPorts) {}

  async invoke(request: FindUserRequest, _response: FindUserResponse): Promise<void> {
    const user = await this.ports.userRepository.findByUsername(request.username)
    if (!user) {
      _response.failure = Failure.USER_NOT_FOUND
      return Promise.resolve()
    }
    _response.user = user
    return Promise.resolve()
  }
}

export interface FindUserPorts {
  userRepository: UserRepository
}
