import { crypto } from 'https://deno.land/std@0.156.0/crypto/mod.ts?s=crypto'
import { Authentication } from '../../domain/value_objects/authentication.ts'
import { AuthenticationRepository } from '../../use-cases/common_ports/database/authentication-repository.ts'

export class InMemoryAuthenticationRepository
  implements AuthenticationRepository
{
  private authentications: Authentication[] = []

  authenticate(userId: string): Promise<Authentication> {
    const authentication = {
      userId: userId,
      token: crypto.randomUUID(),
      tokenExpiresAfter: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    } as Authentication
    this.authentications.push(authentication)
    return Promise.resolve(authentication)
  }

  revokeAuthentication(userId: string): Promise<void> {
    const authenticationsToBeTerminated = this.authentications
      .filter((authentication) => authentication.userId === userId)
      .filter((authentication) => authentication.tokenExpiresAfter > new Date())

    for (const authenticationToBeTerminated of authenticationsToBeTerminated) {
      authenticationToBeTerminated.tokenExpiresAfter = new Date()
    }
    return Promise.resolve()
  }

  isAuthenticated(userId: string): Promise<boolean> {
    const validAuthentications = this.authentications
      .filter((authentications) => authentications.userId === userId)
      .filter(
        (authentications) => authentications.tokenExpiresAfter > new Date()
      )

    return Promise.resolve(validAuthentications.length > 0)
  }
}
