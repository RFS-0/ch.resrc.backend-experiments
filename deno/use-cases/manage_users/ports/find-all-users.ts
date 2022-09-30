import { User } from '../../../domain/entities/user.ts'

export interface FindAllUsers {
  invoke(_response: FindAllUsersResponse): Promise<void>
}

export interface FindAllUsersResponse {
  users: User[]
  failure: Failure | undefined
}

export enum Failure {}
