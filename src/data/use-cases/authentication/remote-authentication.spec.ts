import { faker } from '@faker-js/faker'
import { AuthenticationParams } from '@/domain/use-cases/authentication'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/HttpResponse'
import { HttpPostClient, HttpPostParams } from '@/data/protocols/http/HttpPostClient'
import { RemoteAuthentication } from './remote-authentication'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import { UnexpectedError } from '@/domain/errors/unexpected-error'

class HttpPostClientSpy implements HttpPostClient {
  url?: string
  body?: object
  response: HttpResponse = {
    statusCode: HttpStatusCode.ok,
    body: ''
  }

  async post(params: HttpPostParams): Promise<HttpResponse> {
    this.url = params.url
    this.body = params?.body

    return Promise.resolve(this.response)
  }
}

describe('RemoteAuthentication', () => {
  it('should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()

    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)

    await sut.auth()

    expect(httpPostClientSpy.url).toBe(url)
  })

  it('should call HttpPostClient with correct body', async () => {
    const url = faker.internet.url()
    const body: AuthenticationParams = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)

    await sut.auth(body)

    expect(httpPostClientSpy.body).toEqual(body)
  })

  it('should throw InvalidCredentialError if HttpPostClient returns 401', async () => {
    const url = faker.internet.url()
    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized,
      body: ''
    }

    const promise = sut.auth()

    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  it('should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const url = faker.internet.url()
    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
      body: ''
    }

    const promise = sut.auth()

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
