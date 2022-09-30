import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts'
import { Server } from './dependencies.ts'
import { ApplicationConfiguration } from './application-configuration.ts'
import { parse } from 'https://deno.land/std@0.156.0/flags/mod.ts'

const configuration = new ApplicationConfiguration(parse(Deno.args))

class Application {
  private server: Server

  constructor(private configuration: ApplicationConfiguration) {
    this.server = new Server()
  }

  initialize(): Application {
    this.server.use(oakCors())
    this.server.use(this.configuration.getRoutes())
    return this
  }

  start(): Promise<void> {
    console.log(
      `The application is listening on port: ${this.configuration.port}`
    )
    return this.server.listen({ port: this.configuration.port })
  }
}

await new Application(configuration).initialize().start()
