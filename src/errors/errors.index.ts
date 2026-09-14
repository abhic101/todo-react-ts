import { AppError, InvalidArgError } from './app.errors';
import { NetworkError, type NetworkErrorKind } from './network.errors';

import mapAxiosError from './mapAxiosError.utils'
import {todoErrToCode, authErrToCode, accountErrToCode } from './error.handlers';
import { ErrorKindName, StatusCodeMap } from './error.constants'

// Errors
export {
    AppError,
    InvalidArgError,
    NetworkError
}

// Utils
export {
    mapAxiosError,
    todoErrToCode,
    authErrToCode,
    accountErrToCode,
    ErrorKindName,
    StatusCodeMap
}

// Types
export type {
    NetworkErrorKind
}
