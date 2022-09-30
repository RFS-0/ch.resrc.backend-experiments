import { Middleware, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts'
import { IntendedAuthentication } from '../../domain/value_objects/intended-authentication.ts'
import {
  RevokeAuthentication,
  RevokeAuthenticationRequest,
  RevokeAuthenticationResponse,
} from '../../use-cases/manage_users/ports/revoke-authentication.ts'
import {
  AuthenticateUser,
  AuthenticationRequest,
  AuthenticationResponse,
} from '../../use-cases/manage_users/ports/authenticate-user.ts'
import { IntendedRevocation } from '../../domain/value_objects/intended-revocation.ts'

export class AuthenticationResource {
  private router = new Router({ prefix: '/authentication' })

  constructor(
    private authenticateUserPort: AuthenticateUser,
    private revokeAuthenticationPort: RevokeAuthentication
  ) {
    this.handleAuthenticateUserRequests()
    this.handleRevokeAuthenticationRequests()
  }

  handleAuthenticateUserRequests(): void {
    this.router.post('/', async (context) => {
      const requestBody = context.request.body({ type: 'json' })
      const intendedAuthentication =
        (await requestBody.value) as IntendedAuthentication
      try {
        const request = {
          userId: intendedAuthentication.userId,
          password: intendedAuthentication.password,
        } as AuthenticationRequest
        const response = {} as AuthenticationResponse
        await this.authenticateUserPort.invoke(request, response)
        if (response.failure) {
          context.response.status = 400
          return
        }
        context.response.status = 201
        context.response.body = JSON.stringify(response.authentication)
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        } else {
          console.log('Unexpected error: ', error)
        }
        context.response.status = 400
      }
    })
  }

  handleRevokeAuthenticationRequests(): void {
    this.router.delete('/', async (context) => {
      const requestBody = context.request.body({ type: 'json' })
      const intendedRevocation = (await requestBody.value) as IntendedRevocation
      const request = {
        token: intendedRevocation.token,
      } as RevokeAuthenticationRequest
      const response = {} as RevokeAuthenticationResponse
      await this.revokeAuthenticationPort.invoke(request, response)
      if (response.failure) {
        context.response.status = 400
        return
      }
      context.response.status = 200
    })
  }

  getRoutes(): Middleware {
    return this.router.routes()
  }
}
