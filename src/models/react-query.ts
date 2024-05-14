import { UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export type QueryResponse<T> = UseQueryResult<T, AxiosError>
