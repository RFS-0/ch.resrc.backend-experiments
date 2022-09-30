import { Authentication } from '../../../domain/value_objects/authentication.ts'

export interface AuthenticationRepository {
  authenticate(userId: string): Promise<Authentication>
  revokeAuthentication(userId: string): Promise<void>
  isAuthenticated(userId: string): Promise<boolean>
}
