import { UpdatedUser } from '../../../domain/value_objects/updated-user.ts'
import { User } from '../../../domain/entities/user.ts'

export interface UserRepository {
  create(users: User[]): Promise<void>
  findAll(): Promise<User[]>
  findById(id: string): Promise<User | undefined>
  findByUsername(username: string): Promise<User | undefined>
  updateUser(id: string, updatedUser: UpdatedUser): Promise<void>
  deleteUser(id: string): Promise<void>
}
