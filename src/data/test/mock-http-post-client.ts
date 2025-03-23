import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/HttpResponse'
import { HttpPostClient, HttpPostParams } from '@/data/protocols/http/HttpPostClient'

class HttpPostClientSpy<T, R> implements HttpPostClient<T, R> {
  url?: string
  body?: T
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async post(params: HttpPostParams<T>): Promise<HttpResponse<R>> {
    this.url = params.url
    this.body = params?.body

    return Promise.resolve(this.response)
  }
}

export { HttpPostClientSpy }
