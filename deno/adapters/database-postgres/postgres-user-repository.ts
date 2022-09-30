import {
  Client,
  QueryObjectResult,
} from 'https://deno.land/x/postgres@v0.16.1/mod.ts'
import { UpdatedUser } from '../../domain/value_objects/updated-user.ts'
import { User } from '../../domain/entities/user.ts'
import { UserRepository } from '../../use-cases/common_ports/database/user-repository.ts'

export class PostgresUserRepository implements UserRepository {
  constructor(private client: Client) {}

  async create(users: User[]): Promise<void> {
    await this.client.connect()
    for (const user of users) {
      await this.client.queryArray(`INSERT 
                                    INTO "users" (
                                      "id", 
                                      "username", 
                                      "first_name", 
                                      "last_name", 
                                      "email", 
                                      "password", 
                                      "phone"
                                    )
                                    VALUES (
                                      '${user.id}', 
                                      '${user.username}', 
                                      '${user.firstName}', 
                                      '${user.lastName}', 
                                      '${user.email}', 
                                      '${user.password}', 
                                      '${user.phone}'
                                    );`)
    }
    await this.client.end()
  }

  async findAll(): Promise<User[]> {
    await this.client.connect()
    const result: QueryObjectResult<User> = await this.client.queryObject({
      text: 'SELECT id, username, first_name, last_name, email, password, phone FROM users',
      fields: [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'password',
        'phone',
      ],
    })
    await this.client.end()
    return Promise.resolve(result.rows)
  }

  async findById(id: string): Promise<User | undefined> {
    await this.client.connect()
    const result: QueryObjectResult<User> = await this.client.queryObject({
      text: `SELECT
              id,
              username,
              first_name,
              last_name,
              email,
              password,
              phone
            FROM users
            WHERE
              id = '${id}'`,

      fields: [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'password',
        'phone',
      ],
    })
    await this.client.end()
    return Promise.resolve(result.rows[0])
  }

  async findByUsername(username: string): Promise<User | undefined> {
    await this.client.connect()
    const result: QueryObjectResult<User> = await this.client.queryObject({
      text: `SELECT
              id,
              username,
              first_name,
              last_name,
              email,
              password,
              phone
            FROM users
            WHERE
              username = '${username}'`,

      fields: [
        'id',
        'username',
        'firstName',
        'lastName',
        'email',
        'password',
        'phone',
      ],
    })
    await this.client.end()
    return Promise.resolve(result.rows[0])
  }

  async updateUser(id: string, updatedUser: UpdatedUser): Promise<void> {
    await this.client.connect()
    const query = `
            UPDATE
              users
            SET
              username = '"${updatedUser.username}"',
              first_name = '"${updatedUser.firstName}"',
              last_name = '"${updatedUser.lastName}"',
              email = '"${updatedUser.email}"',
              password = '"${updatedUser.password}"',
              phone = '"${updatedUser.phone}"'
            WHERE
              id = '${id}'`
    await this.client.queryObject({ text: query })
    await this.client.end()
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.connect()
    await this.client.queryObject({
      text: `DELETE FROM
              users
            WHERE
              id = '${id}'`,
    })
    await this.client.end()
  }
}
