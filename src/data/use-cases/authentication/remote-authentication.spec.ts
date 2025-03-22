import { HttpPostClient, HttpPostParams } from '@/data/protocols/http/HttpPostClient'
import { RemoteAuthentication } from './remote-authentication'
import { faker } from '@faker-js/faker'

class HttpPostClientSpy implements HttpPostClient {
  url?: string
  body?: any

  async post(params: HttpPostParams): Promise<any> {
    this.url = params.url
    this.body = params?.body

    return Promise.resolve()
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
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    const httpPostClientSpy = new HttpPostClientSpy()

    const sut = new RemoteAuthentication(url, httpPostClientSpy)

    await sut.auth(body)

    expect(httpPostClientSpy.body).toEqual(body)
  })
})
