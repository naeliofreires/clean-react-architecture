import { faker } from '@faker-js/faker'
import { AuthenticationParams } from '@/domain/use-cases/authentication'
import { HttpStatusCode } from '@/data/protocols/http/HttpResponse'
import { RemoteAuthentication } from './remote-authentication'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import { UnexpectedError } from '@/domain/errors/unexpected-error'
import { HttpPostClientSpy } from '@/data/test/mock-http-post-client'
import { AccountModel } from '@/domain/models/account-model'

const makeSut = (url: string) => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  it('should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.auth()

    expect(httpPostClientSpy.url).toBe(url)
  })

  it('should call HttpPostClient with correct body', async () => {
    const url = faker.internet.url()
    const body: AuthenticationParams = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    const { sut, httpPostClientSpy } = makeSut(url)

    await sut.auth(body)

    expect(httpPostClientSpy.body).toEqual(body)
  })

  it('should throw InvalidCredentialError if HttpPostClient returns 401', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }

    const promise = sut.auth()

    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  it('should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }

    const promise = sut.auth()

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('should return an AccountModel if HttpPostClient returns 200', async () => {
    // @TODO: Implement
  })
})
