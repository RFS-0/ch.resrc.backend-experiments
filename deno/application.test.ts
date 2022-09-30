import { describe, it } from 'https://deno.land/std@0.157.0/testing/bdd.ts'
import { User } from './domain/entities/user.ts'
import { IntendedRevocation } from './domain/value_objects/intended-revocation.ts'
import { IntendedAuthentication } from './domain/value_objects/intended-authentication.ts'
import {
  assertEquals,
  fail,
} from 'https://deno.land/std@0.152.0/testing/asserts.ts'
import { Args, parse } from 'https://deno.land/std@0.156.0/flags/mod.ts'
import { crypto } from 'https://deno.land/std@0.156.0/crypto/mod.ts?s=crypto'
import { Authentication } from './domain/value_objects/authentication.ts'

function parseBaseUrlOrUseDefault(args: Args, defaultBaseUrl: string): string {
  if (args.b) {
    return args.b
  } else if (args.baseUrl) {
    return args.baseUrl
  } else {
    return defaultBaseUrl
  }
}

function postRequest<T>(path: string, data: T): Promise<Response> {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  const request: Request = new Request(encodeURI(`${baseUrl}/${path}`), {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
  return fetch(request)
}

function getRequest(
  path: string,
  path_params = '',
  query_params = ''
): Promise<Response> {
  return fetch(`${baseUrl}/${path}/${path_params}?${query_params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

function putRequest<T>(
  path: string,
  path_params = '',
  data: T
): Promise<Response> {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  const request: Request = new Request(
    encodeURI(`${baseUrl}/${path}/${path_params}`),
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    }
  )
  return fetch(request)
}

function deleteRequest<T>(
  path: string,
  path_params = '',
  data: T | null = null
): Promise<Response> {
  return fetch(`${baseUrl}/${path}/${path_params}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

const baseUrl = parseBaseUrlOrUseDefault(
  parse(Deno.args),
  'http://localhost:8000/petstore'
)

describe('The user resource', () => {
  it('should be able to create a new user', async () => {
    // given
    const user = {
      username: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User

    // when, then
    await postRequest('user', user)
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 201, 'could not create a new user')
      })
      .catch((error) =>
        fail(`Request to create new user failed because: ${error}`)
      )
  })
  it('should be able to create new users', async () => {
    // given
    const user = {
      username: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User

    // when, then
    await postRequest('user/create-multiple', [user])
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 201, 'could not create new users')
      })
      .catch((error) =>
        fail(`Request to create new users failed because: ${error}`)
      )
  })
  it('should not be able to create a new user if invalid user is provided', async () => {
    // given
    const invalidUser = {
      username: "'invalid",
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User

    // when, then
    await postRequest('user', invalidUser)
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 400)
      })
      .catch((error) =>
        fail(`Request to create new user failed because: ${error}`)
      )
  })
  it('should not be able to create new users if some invalid user is provided', async () => {
    // given
    const invalidUser = {
      username: "'invalid",
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User

    // when, then
    await postRequest('user/create-multiple', [invalidUser])
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 400)
      })
      .catch((error) =>
        fail(`Request to create new user failed because: ${error}`)
      )
  })
  it('should be able to update an existing user', async () => {
    // given
    const someUniqueName = crypto.randomUUID()
    const userToBeCreated = {
      username: someUniqueName,
      firstName: 'oldFirstName',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User
    const existingUser = await postRequest('user', userToBeCreated).then(
      async (response: Response) => {
        return (await response?.json()) as User
      }
    )
    const updatedUser = {
      username: someUniqueName,
      firstName: 'newFirstName',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User

    // when
    await putRequest('user', existingUser.id, updatedUser)
      // then
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 204)
      })
      .catch((error) => fail(`Request to update user failed because: ${error}`))
  })
  it('should not be able to update a user which does not exist', async () => {
    // given
    const cannotBeFound = 'usernameThatCannotBeFound'

    // when, then
    await getRequest('user', cannotBeFound)
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 400)
      })
      .catch((error) => fail(`Request to update user failed because: ${error}`))
  })
  it('should be able to delete an existing user', async () => {
    // given
    const someUniqueName = crypto.randomUUID()
    const existingUserToBeCreated = {
      username: someUniqueName,
      firstName: 'oldFirstName',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User
    const existingUser = await postRequest(
      'user',
      existingUserToBeCreated
    ).then(async (response: Response) => {
      return (await response.json()) as User
    })

    // when, then
    await deleteRequest('user', existingUser.id)
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 204)
      })
      .catch((error) => fail(`Request to delete user failed because: ${error}`))
  })
  it('should be able to find an existing user by username', async () => {
    // given
    const find_me = crypto.randomUUID()
    const anExistingUser = {
      username: find_me,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User
    await postRequest('user', anExistingUser).then((response: Response) =>
      response.body?.cancel()
    )

    // when, then
    await getRequest('user', find_me)
      .then((response) => {
        response.body?.cancel()
        assertEquals(response.status, 200)
      })
      .catch((error) => fail(`Request to find user failed because: ${error}`))
  })
  it('should not be able to find a user if no user with the specified username exists', async () => {
    // given
    const cannotBeFound = 'usernameThatCannotBeFound'

    // when, then
    await getRequest('user', cannotBeFound)
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 400)
      })
      .catch((error) => fail(`Request to find user failed because: ${error}`))
  })
  it('should be able to find all existing users', async () => {
    // given
    const someUser = {
      username: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User
    const anotherUser = {
      username: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    } as User

    await postRequest('user/create-multiple', [someUser, anotherUser])
      .then(async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 201, 'could not create new users')
      })
      .catch((error) =>
        fail(`Request to find all users failed because: ${error}`)
      )

    // when
    const users: User[] = await getRequest('user', 'find-all').then(
      async (response) => {
        assertEquals(response.status, 200)
        return (await response.json()) as User[]
      }
    )

    // then
    assertEquals(users.length > 1, true)
  })
})

describe('The authentication resource', () => {
  it('should be able to authenticate a user', async () => {
    // given
    const user = {
      username: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email: '',
      password: 'some-password',
      phone: '',
    } as User

    const userToBeAuthenticated: User = await postRequest('user', user).then(
      async (response: Response) => {
        return (await response.json()) as User
      }
    )
    // when, then
    const intendedAuthentication = {
      userId: userToBeAuthenticated.id,
      password: 'some-password',
    } as IntendedAuthentication
    await postRequest('authentication', intendedAuthentication).then(
      async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 201)
      }
    )
  })
  it('should not be able to authenticate a user if password is wrong', async () => {
    // given
    const user = {
      username: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email: '',
      password: 'another-password',
      phone: '',
    } as User

    const userToBeAuthenticated: User = await postRequest('user', user).then(
      async (response: Response) => {
        return (await response.json()) as User
      }
    )

    // when, then
    const intendedAuthentication = {
      userId: userToBeAuthenticated.id,
      password: 'wrong-password',
    } as IntendedAuthentication
    await postRequest('authentication', intendedAuthentication).then(
      async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 400)
      }
    )
  })
  it('should be able to revoke an authentication of an authenticated user', async () => {
    // given
    const user = {
      username: crypto.randomUUID(),
      firstName: '',
      lastName: '',
      email: '',
      password: 'some-password',
      phone: '',
    } as User

    const userToBeAuthenticated: User = await postRequest('user', user).then(
      async (response: Response) => {
        return (await response.json()) as User
      }
    )
    const intendedAuthentication = {
      userId: userToBeAuthenticated.id,
      password: 'some-password',
    } as IntendedAuthentication
    const authentication = await postRequest(
      'authentication',
      intendedAuthentication
    ).then(async (response) => {
      assertEquals(response.status, 201)
      return (await response.json()) as Authentication
    })

    // when, then
    const request = { token: authentication.token } as IntendedRevocation
    await deleteRequest('authentication', '', request).then(
      async (response) => {
        await response.body?.cancel()
        assertEquals(response.status, 200)
      }
    )
  })
})
