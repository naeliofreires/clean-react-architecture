import { HttpPostClient } from '@/data/protocols/http/HttpPostClient'
import { RemoteAuthentication } from './remote-authentication'

class HttpPostClientSpy implements HttpPostClient {
  url?: string

  async post(url: string): Promise<any> {
    this.url = url
    return Promise.resolve()
  }
}

describe('RemoteAuthentication', () => {
  it('should call HttpPostClient with correct URL', async () => {
    const url = 'any+url+value'

    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)

    await sut.auth()

    expect(httpPostClientSpy.url).toBe(url)
  })
})
