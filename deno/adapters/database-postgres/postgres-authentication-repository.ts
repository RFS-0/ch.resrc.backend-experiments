import {
  Client,
  QueryObjectResult,
} from 'https://deno.land/x/postgres@v0.16.1/client.ts'
import { Authentication } from '../../domain/value_objects/authentication.ts'
import { AuthenticationRepository } from '../../use-cases/common_ports/database/authentication-repository.ts'

export class PostgresAuthenticationRepository
  implements AuthenticationRepository
{
  constructor(private client: Client) {}

  async authenticate(userId: string): Promise<Authentication> {
    const authentication = {
      userId: userId,
      token: crypto.randomUUID(),
      tokenExpiresAfter: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    } as Authentication
    await this.client.connect()
    const query = `INSERT INTO 
                    authentications (
                      "user_id", 
                      "token", 
                      "token_expires_after"
                    )
                    VALUES (
                      '${authentication.userId}', 
                      '${authentication.token}', 
                      '${authentication.tokenExpiresAfter.toISOString()}' 
                    );`
    // console.log(query)
    await this.client.queryArray(query)
    await this.client.end()
    return Promise.resolve(authentication)
  }

  async isAuthenticated(userId: string): Promise<boolean> {
    await this.client.connect()
    const result: QueryObjectResult<number> = await this.client.queryObject({
      text: `SELECT
              count(*)
            FROM authentications
            WHERE
              user_id = '${userId}'
              AND token_expires_after > CURRENT_TIMESTAMP`,

      fields: ['numberOfValidAuthentications'],
    })
    await this.client.end()
    return Promise.resolve(result.rows[0].numberOfValidAuthentications > 0)
  }

  async revokeAuthentication(userId: string): Promise<void> {
    await this.client.connect()
    const query = `
      UPDATE
        authentications
      SET
        token_expires_after  = CURRENT_TIMESTAMP
      WHERE
        user_id = '${userId}'
    `
    console.log(query)
    await this.client.queryObject({
      text: query,
    })
    await this.client.end()
  }
}
