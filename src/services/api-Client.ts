/* eslint-disable import/no-unresolved */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { RequestData, ServerResponse } from '../models/common/api-client'
import { MESSAGES } from '@/content/constant'

export const SESSION_EXPIRED_EVENT = 'uni-session-expired'

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
  { id, page, size, data, headers, method, transform = true, customBaseUrl = false, userCode, email, isFormData, ...rest }: RequestData<U> = {}
): Promise<ServerResponse<T>> => {
  const finalHeaders = {
    ...headers,
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  }

  const config: AxiosRequestConfig = {
    url: customBaseUrl ? `${endpoint}` : `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
    method: method || (data ? 'POST' : 'GET'),
    data: isFormData ? data : data ? JSON.stringify(data) : undefined,
    headers: finalHeaders,
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
    if (axios.isAxiosError(err) && !err.response) {
      return Promise.reject({
        ...err,
        response: {
          status: 503,
          data: {
            message: MESSAGES.BACKEND_UNAVAILABLE,
          },
        },
      })
    }

    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const message = err.response?.data?.message

      if (status === 401 && message === 'Expired Token' && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
      }
    }

    return Promise.reject(err)
  }
}

export { client }
