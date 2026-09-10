import { AppError, InvalidArgError } from './app.errors';
import { NetworkError, type NetworkErrorKind } from './network.errors';

import mapAxiosError from './mapAxiosError.utils'
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
    ErrorKindName,
    StatusCodeMap
}

// Types
export type {
    NetworkErrorKind
}
