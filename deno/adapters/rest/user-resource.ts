import {
  Middleware,
  Router,
} from 'https://deno.land/x/oak@v11.1.0/mod.ts'
import {
  CreateUsers,
  CreateUsersRequest,
  CreateUsersResponse,
} from '../../use-cases/manage_users/ports/create-user.ts'
import {
  FindUserByUsername,
  FindUserRequest,
  FindUserResponse,
} from '../../use-cases/manage_users/ports/find-user-by-username.ts'
import {
  UpdateUser,
  UpdateUserRequest,
  UpdateUserResponse,
} from '../../use-cases/manage_users/ports/update-user.ts'
import {
  DeleteUser,
  DeleteUserRequest,
  DeleteUserResponse,
} from '../../use-cases/manage_users/ports/delete-user.ts'
import {
  FindAllUsers,
  FindAllUsersResponse,
} from '../../use-cases/manage_users/ports/find-all-users.ts'
import { IntendedUser } from '../../domain/value_objects/intended-user.ts'
import { UpdatedUser } from '../../domain/value_objects/updated-user.ts'

export class UserResource {
  private router = new Router({ prefix: '/user' })

  constructor(
    private createUserPort: CreateUsers,
    private findAllUsers: FindAllUsers,
    private findUserByUsername: FindUserByUsername,
    private updateUser: UpdateUser,
    private deleteUser: DeleteUser
  ) {
    this.handleCreateUserRequests()
    this.handleCreateUsersRequests()
    this.handleFindAllUsersRequests()
    this.handleFindUserByNameRequests()
    this.handleUpdateUserRequests()
    this.handleDeleteUserRequests()
  }

  handleCreateUserRequests(): void {
    this.router.post('/', async (context) => {
      const result = context.request.body({ type: 'json' })
      const intendedUsers = (await result.value) as IntendedUser
      try {
        const request = { users: [intendedUsers] } as CreateUsersRequest
        const response = {} as CreateUsersResponse
        await this.createUserPort.invoke(request, response)
        if (response.failure) {
          context.response.status = 400
          return
        }
        context.response.status = 201
        context.response.body = JSON.stringify(response.users[0])
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

  handleCreateUsersRequests(): void {
    this.router.post('/create-multiple', async (context) => {
      const result = context.request.body({ type: 'json' })
      const intendedUsers = (await result.value) as IntendedUser[]
      try {
        const request = { users: intendedUsers } as CreateUsersRequest
        const response = {} as CreateUsersResponse
        await this.createUserPort.invoke(request, response)
        if (response.failure) {
          context.response.status = 400
          return
        }
        context.response.status = 201
        context.response.body = JSON.stringify(response.users)
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

  handleUpdateUserRequests(): void {
    this.router.put('/:id', async (context) => {
      const userId = context.params.id
      const requestBody = context.request.body({ type: 'json' })
      const updatedUser = (await requestBody.value) as UpdatedUser
      const request = {
        id: userId,
        updatedUser: updatedUser,
      } as UpdateUserRequest
      const response = {} as UpdateUserResponse
      await this.updateUser.invoke(request, response)
      if (response.failure) {
        context.response.status = 400
        return
      }
      context.response.status = 204
    })
  }

  handleFindUserByNameRequests(): void {
    this.router.get('/:id', async (context) => {
      const response = {} as FindUserResponse
      await this.findUserByUsername.invoke(
        { username: context.params.id } as FindUserRequest,
        response
      )
      if (response.failure) {
        context.response.status = 400
        return
      }
      context.response.status = 200
      context.response.body = JSON.stringify(response.user)
    })
  }

  handleFindAllUsersRequests(): void {
    this.router.get('/find-all', async (context) => {
      const response = {} as FindAllUsersResponse
      await this.findAllUsers.invoke(response)
      if (response.failure) {
        context.response.status = 400
        return
      }
      context.response.status = 200
      context.response.body = JSON.stringify(response.users)
    })
  }

  handleDeleteUserRequests(): void {
    this.router.delete('/:id', async (context) => {
      const request = { id: context.params.id } as DeleteUserRequest
      const response = {} as DeleteUserResponse
      await this.deleteUser.invoke(request, response)
      if (response.failure) {
        context.response.status = 400
        return
      }
      context.response.status = 204
    })
  }

  getRoutes(): Middleware {
    return this.router.routes()
  }
}
