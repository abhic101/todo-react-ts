import type { AxiosError } from 'axios';
import { ErrorKindName, StatusCodeMap } from './error.constants';

type NetworkErrorKind = 'unreachable' | 'timeout' | 'aborted' | 'http' | 'parse' | 'unknown';

type NetworkErrorConstructorArg = {
    kind?: NetworkErrorKind;
    isRetryable?: boolean;
    cause?: AxiosError;
}

// Custom error class to represent errors
class NetworkError extends Error {
    public kind: NetworkErrorKind;
    public isRetryable: boolean;
    public name: string;
    public statusCode: number;

    constructor ( message: string, {
            kind = 'unknown',
            isRetryable = false,
            cause = undefined
        } : NetworkErrorConstructorArg = {
            kind: 'unknown',
            isRetryable: false,
            cause: undefined
        }) {
        super(message, {cause: cause});
        this.kind = kind;
        this.isRetryable = isRetryable ;
        this.name = ErrorKindName[kind];
        if (kind !== 'http')
            this.statusCode = StatusCodeMap[kind];
        else this.statusCode = cause?.response?.status as number;

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);
    }
}

export {
    NetworkError
};
export type {
    NetworkErrorKind,
}