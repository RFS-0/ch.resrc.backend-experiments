import { Router } from 'https://deno.land/x/oak@v11.1.0/router.ts'
import { Client } from 'https://deno.land/x/postgres@v0.16.1/mod.ts'
import { Middleware } from 'https://deno.land/x/oak@v11.1.0/mod.ts'
import { UserRepository } from './use-cases/common_ports/database/user-repository.ts'
import { CreateUsers } from './use-cases/manage_users/ports/create-user.ts'
import { UserResource } from './adapters/rest/user-resource.ts'
import { AuthenticationResource } from './adapters/rest/authentication-resource.ts'
import { CreateUserUseCase } from './use-cases/manage_users/create-user-use-case.ts'
import { AuthenticationRepository } from './use-cases/common_ports/database/authentication-repository.ts'
import { RevokeAuthentication } from './use-cases/manage_users/ports/revoke-authentication.ts'
import { FindUserByUsername } from './use-cases/manage_users/ports/find-user-by-username.ts'
import { FindUserByUsernameUseCase } from './use-cases/manage_users/find-user-by-username-use-case.ts'
import { AuthenticateUserUseCase } from './use-cases/manage_users/authenticate-user-use-case.ts'
import { UpdateUser } from './use-cases/manage_users/ports/update-user.ts'
import { UpdateUserUseCase } from './use-cases/manage_users/update-user-use-case.ts'
import { DeleteUser } from './use-cases/manage_users/ports/delete-user.ts'
import { AuthenticateUser } from './use-cases/manage_users/ports/authenticate-user.ts'
import { DeleteUserUseCase } from './use-cases/manage_users/delete-user-use-case.ts'
import { PostgresUserRepository } from './adapters/database-postgres/postgres-user-repository.ts'
import { FindAllUsers } from './use-cases/manage_users/ports/find-all-users.ts'
import { FindAllUsersUseCase } from './use-cases/manage_users/find-all-users-use-case.ts'
import { PostgresAuthenticationRepository } from './adapters/database-postgres/postgres-authentication-repository.ts'
import { RevokeAuthenticationUseCase } from './use-cases/manage_users/revoke-authentication-use-case.ts'
import { type Args } from 'https://deno.land/std@0.156.0/flags/mod.ts'

export class ApplicationConfiguration {
  private _port: number
  private client: Client
  private userRepository: UserRepository
  private authenticationRepository: AuthenticationRepository

  private router = new Router()

  private createUser: CreateUsers
  private revokeAuthentication: RevokeAuthentication
  private findAllUsers: FindAllUsers
  private findUserByUsername: FindUserByUsername
  private updateUser: UpdateUser
  private deleteUser: DeleteUser

  private authenticateUser: AuthenticateUser

  private userResource: UserResource
  private authenticationResource: AuthenticationResource

  constructor(args: Args) {
    const cliArgs = new CliArgs(args)
    this._port = cliArgs.port
    const envArgs = new EnvArgs()
    this.client = new Client({
      hostname: envArgs.dbConfig.hostname,
      port: envArgs.dbConfig.port,
      database: envArgs.dbConfig.database,
      user: envArgs.dbConfig.user,
      password: envArgs.dbConfig.password,
    })
    this.userRepository = new PostgresUserRepository(this.client)
    this.authenticationRepository = new PostgresAuthenticationRepository(
      this.client
    )
    this.createUser = new CreateUserUseCase({
      userRepository: this.userRepository,
    })
    this.authenticateUser = new AuthenticateUserUseCase({
      userRepository: this.userRepository,
      authenticationRepository: this.authenticationRepository,
    })
    this.revokeAuthentication = new RevokeAuthenticationUseCase({
      authenticationRepository: this.authenticationRepository,
    })
    this.findAllUsers = new FindAllUsersUseCase({
      userRepository: this.userRepository,
    })
    this.findUserByUsername = new FindUserByUsernameUseCase({
      userRepository: this.userRepository,
    })
    this.updateUser = new UpdateUserUseCase({
      userRepository: this.userRepository,
    })
    this.deleteUser = new DeleteUserUseCase({
      userRepository: this.userRepository,
    })
    this.userResource = new UserResource(
      this.createUser,
      this.findAllUsers,
      this.findUserByUsername,
      this.updateUser,
      this.deleteUser
    )
    this.authenticationResource = new AuthenticationResource(
      this.authenticateUser,
      this.revokeAuthentication
    )
  }

  get port(): number {
    return this._port
  }

  getRoutes(): Middleware {
    this.router.use(
      '/petstore',
      this.userResource.getRoutes(),
      this.authenticationResource.getRoutes(),
      this.router.allowedMethods()
    )
    return this.router.routes()
  }
}

class CliArgs {
  private _port: number

  constructor(args: Args) {
    this._port = this.parsePortOrUseDefault(args, 8000)
  }

  parsePortOrUseDefault(args: Args, defaultPort: number): number {
    if (args.p) {
      return args.p
    } else if (args.port) {
      return args.port
    } else {
      return defaultPort
    }
  }

  get port(): number {
    return this._port
  }
}

class EnvArgs {
  private _dbConfig: DatabaseConfig

  constructor() {
    this._dbConfig = this.createDatabaseConfig()
    console.log(this.dbConfig)
  }

  createDatabaseConfig(): DatabaseConfig {
    return new DatabaseConfig()
  }

  get dbConfig(): DatabaseConfig {
    return this._dbConfig
  }
}

class DatabaseConfig {
  private _hostname: string
  private _port: number
  private _database: string
  private _user: string
  private _password: string

  constructor() {
    this._hostname = this.getDbHostOrUseDefault('localhost')
    this._port = this.getDbPortOrUseDefault(5432)
    this._database = this.getDbNameOrUseDefault('experiments')
    this._user = this.getDbUserOrUseDefault('user')
    this._password = this.getDbPasswordOrUseDefault('user123')
  }

  getDbHostOrUseDefault(defaultDbHost: string): string {
    const host = Deno.env.get('DB_HOST')
    return host ? host : defaultDbHost
  }

  getDbPortOrUseDefault(defaultPort: number): number {
    const dbPort = Deno.env.get('DB_PORT')
    return dbPort ? parseInt(dbPort) : defaultPort
  }

  getDbNameOrUseDefault(defaultDatabase: string): string {
    const database = Deno.env.get('DB_NAME')
    return database ? database : defaultDatabase
  }

  getDbUserOrUseDefault(defaultUser: string): string {
    const database = Deno.env.get('DB_USER')
    return database ? database : defaultUser
  }

  getDbPasswordOrUseDefault(defaultPassword: string): string {
    const password = Deno.env.get('DB_PASSWORD')
    return password ? password : defaultPassword
  }

  get hostname(): string {
    return this._hostname
  }

  get port(): number {
    return this._port
  }

  get database(): string {
    return this._database
  }

  get user(): string {
    return this._user
  }

  get password(): string {
    return this._password
  }
}
