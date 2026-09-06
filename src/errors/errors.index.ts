import { AppError, InvalidArgError } from './app.errors';
import { NetworkError, type NetworkErrorKind } from './network.errors';

import mapAxiosError from './mapAxiosError.utils'

// Errors
export {
    AppError,
    InvalidArgError,
    NetworkError
}

// Utils
export {
    mapAxiosError
}

// Types
export type {
    NetworkErrorKind
}
