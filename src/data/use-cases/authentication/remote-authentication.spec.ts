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

const makeBody = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('RemoteAuthentication', () => {
  it('should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.auth(makeBody())

    expect(httpPostClientSpy.url).toBe(url)
  })

  it('should call HttpPostClient with correct body', async () => {
    const url = faker.internet.url()
    const body = makeBody()
    const { sut, httpPostClientSpy } = makeSut(url)

    await sut.auth(body)

    expect(httpPostClientSpy.body).toEqual(body)
  })

  it('should throw InvalidCredentialError if HttpPostClient returns 401', async () => {
    const url = faker.internet.url()
    const body = makeBody()
    const { sut, httpPostClientSpy } = makeSut(url)

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }

    const promise = sut.auth(body)

    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  it('should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const url = faker.internet.url()
    const body = makeBody()
    const { sut, httpPostClientSpy } = makeSut(url)

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }

    const promise = sut.auth(body)

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  it('should return an AccountModel if HttpPostClient returns 200', async () => {
    const url = faker.internet.url()
    const body = makeBody()
    const createdAccount = {
      accessToken: faker.string.uuid()
    }

    const { sut, httpPostClientSpy } = makeSut(url)

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: createdAccount
    }

    const res = await sut.auth(body)

    expect(res).toEqual(createdAccount)
  })
})
