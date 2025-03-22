import { HttpPostClient } from '@/data/protocols/http/HttpPostClient'
import { AuthenticationParams } from '@/domain/use-cases/authentication'

class RemoteAuthentication {
  private readonly url: string
  private readonly httpPostClient: HttpPostClient

  constructor(url: string, httpPostClient: HttpPostClient) {
    this.url = url
    this.httpPostClient = httpPostClient
  }

  async auth(body?: AuthenticationParams): Promise<void> {
    this.httpPostClient.post({ url: this.url, body })

    return Promise.resolve()
  }
}

export { RemoteAuthentication }

/**
 * Why?
 * - We don't want to couple to a specific HTTP tool like Axios, for example.
 *
 * Why?
 * - I want to easily change the HTTP tool I'm using.
 *
 * Why?
 * - I want to be able to test my code independently, without depending on a specific tool.
 *
 * What we will do?
 * - We will create an interface that defines the contract for the class that will make the HTTP requests.
 * - We will create a class that implements this interface and uses the HTTP tool we want.
 * - We will create a class that uses the interface and not the concrete class.
 * - So, we can change the HTTP tool we are using, just by changing the class that implements the interface.
 */
