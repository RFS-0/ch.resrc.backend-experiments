import { UserRepository } from '../common_ports/database/user-repository.ts'
import {
  DeleteUser,
  DeleteUserRequest,
  DeleteUserResponse,
} from './ports/delete-user.ts'

export class DeleteUserUseCase implements DeleteUser {
  constructor(private ports: DeleteUserPorts) {}

  invoke(
    request: DeleteUserRequest,
    _response: DeleteUserResponse
  ): Promise<void> {
    return this.ports.userRepository.deleteUser(request.id)
  }
}

export interface DeleteUserPorts {
  userRepository: UserRepository
}
