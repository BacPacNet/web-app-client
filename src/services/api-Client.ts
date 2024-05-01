/* eslint-disable import/no-unresolved */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { RequestData, ServerResponse } from '../models/common/api-client'

/**
 * Handle Network Requests.
 * @param {string} endpoint - Api path.
 * @param {object} [config={}] - Config object.
 * @param {string} config.method - Method.
 * @param {object} config.data - Body for POST calls.
 * @param {string} config.token - Token for authenticated calls.
 * @param {object} config.headers - Additional headers
 */

const client = async <T, U>(
  endpoint: string,
  {
    id,

    page,
    size,
    data,
    headers,
    method,
    transform = true,
    customBaseUrl = false,
    userCode,
    email,
    ...rest
  }: RequestData<U> = {}
): Promise<ServerResponse<T>> => {
  const config: AxiosRequestConfig = {
    url: customBaseUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}` : `/api/${endpoint}`,
    method: method || (data ? 'POST' : 'GET'),
    data: data ? JSON.stringify(data) : undefined,
    headers: { ...headers, 'Content-Type': 'application/json' },
    params: {
      id,

      page,
      size,
      userCode,
      email,
    },
    transformResponse: [].concat(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      axios.defaults.transformResponse,
      (resp: ServerResponse<T>) => {
        if (transform && resp.items) {
          return resp.items
        }
        return resp
      }
    ),
    ...rest,
  }

  try {
    const response: AxiosResponse<ServerResponse<T>> = await axios(config)
    const { data: resData } = response

    return resData
  } catch (err) {
    return Promise.reject(err)
  }
}

export { client }
