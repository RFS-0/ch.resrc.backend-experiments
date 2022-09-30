import { UserRepository } from '../common_ports/database/user-repository.ts'
import { FindAllUsers, FindAllUsersResponse } from './ports/find-all-users.ts'

export class FindAllUsersUseCase implements FindAllUsers {
  constructor(private ports: FindAllUsersPorts) {}

  async invoke(_response: FindAllUsersResponse): Promise<void> {
    _response.users = await this.ports.userRepository.findAll()
  }
}

export interface FindAllUsersPorts {
  userRepository: UserRepository
}
