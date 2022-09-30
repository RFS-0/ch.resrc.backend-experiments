import { UpdatedUser } from '../../domain/value_objects/updated-user.ts'
import { User } from '../../domain/entities/user.ts'
import { UserRepository } from '../../use-cases/common_ports/database/user-repository.ts'

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  create(users: User[]): Promise<void> {
    this.users = this.users.concat(users)
    return Promise.resolve()
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users)
  }

  findById(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.id === id))
  }

  findByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(
      this.users.find((user) => user.username?.match(username))
    )
  }

  updateUser(id: string, updatedUser: UpdatedUser): Promise<void> {
    const indexOfUserToBeUpdated = this.users.findIndex(
      (user) => user.id === id
    )
    const oldUser = this.users[indexOfUserToBeUpdated]
    this.users.splice(indexOfUserToBeUpdated, 1, {
      ...oldUser,
      ...updatedUser,
    })
    return Promise.resolve()
  }

  deleteUser(id: string): Promise<void> {
    const indexOfUserToBeDeleted = this.users.findIndex(
      (user) => user.id === id
    )
    this.users.splice(indexOfUserToBeDeleted, 1)
    return Promise.resolve()
  }
}
