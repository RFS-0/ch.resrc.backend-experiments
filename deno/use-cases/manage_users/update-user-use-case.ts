import { UserRepository } from '../common_ports/database/user-repository.ts'
import {
Failure,
  UpdateUser,
  UpdateUserRequest,
  UpdateUserResponse,
} from './ports/update-user.ts'

export class UpdateUserUseCase implements UpdateUser {
  constructor(private ports: UpdateUserPorts) {}

  async invoke(
    request: UpdateUserRequest,
    _response: UpdateUserResponse
  ): Promise<void> {
    try {
      await this.ports.userRepository.updateUser(request.id, request.updatedUser)
    } catch (error) {
      console.log(error)
      _response.failure = Failure.COULD_NOT_UPDATE_USER 
    }
  }
}

export interface UpdateUserPorts {
  userRepository: UserRepository
}
