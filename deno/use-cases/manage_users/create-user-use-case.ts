import {
  CreateUsers,
  CreateUsersRequest,
  CreateUsersResponse,
  Failure,
} from './ports/create-user.ts'
import { UserRepository } from '../common_ports/database/user-repository.ts'
import { IntendedUser } from '../../domain/value_objects/intended-user.ts'
import { User } from '../../domain/entities/user.ts'

export class CreateUserUseCase implements CreateUsers {
  constructor(private ports: CreateUserPorts) {}

  async invoke(
    request: CreateUsersRequest,
    _response: CreateUsersResponse
  ): Promise<void> {
    const users: User[] = request.users.map((intendedUser: IntendedUser) => {
      return {
        id: crypto.randomUUID(),
        ...intendedUser,
      } as User
    })
    try {
      await this.ports.userRepository.create(users)
      _response.users = users
    } catch (error) {
      console.log(error)
      _response.failure = Failure.COULD_NOT_CREATE_USER
    }
    _response.users = users
  }
}

export interface CreateUserPorts {
  userRepository: UserRepository
}
