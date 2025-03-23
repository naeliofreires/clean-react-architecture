import { HttpPostClient } from '@/data/protocols/http/HttpPostClient'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/HttpResponse'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import { UnexpectedError } from '@/domain/errors/unexpected-error'
import { AccountModel } from '@/domain/models/account-model'
import { AuthenticationParams } from '@/domain/use-cases/authentication'

class RemoteAuthentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
  ) {}

  async auth(body?: AuthenticationParams): Promise<HttpResponse<AccountModel | null>> {
    const response = await this.httpPostClient.post({ url: this.url, body })

    switch (response.statusCode) {
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError()
      case HttpStatusCode.badRequest:
        throw new UnexpectedError()
      default:
        return {
          statusCode: HttpStatusCode.ok,
          body: null
        }
    }
  }
}

export { RemoteAuthentication }

/**
 * Why?
 * - We don't want to couple to a specific HTTP tool like Axios, for example.
 * - That's why we're using a protocol (interface) called HttpPostClient to define the contract for the class that will make the HTTP requests.
 *
 * Why?
 * - I want to easily change the HTTP tool I'm using.
 * - For example, I want to use Fetch instead of Axios.
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
