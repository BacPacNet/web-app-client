import { AxiosError } from 'axios'

export type StatusType = 'idle' | 'pending' | 'resolved' | 'rejected'
export type ErrorType = Error | AxiosError | string | symbol | null

export type PromiseResolve = (<T>(val: T) => void) | undefined
export type PromiseReject = (<T>(err: T) => void) | undefined
