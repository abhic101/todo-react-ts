import { StatusCodeMap as ErrCode, ErrorKindName as ErrName } from "./error.constants";
import { NetworkError } from './network.errors';
import { AppError } from './app.errors';

function todoErrToCode(err: Error) {
    if(err instanceof NetworkError) {
        switch(err.name) {
            case ErrName.aborted:
                return ErrCode.aborted;
            case ErrName.parse:
                return 500;
            case ErrName.timeout:
                return ErrCode.timeout;
            case ErrName.unknown:
                return 500;
            case ErrName.unreachable:
                return ErrCode.unreachable;
        }
        if (err.name === ErrName.http) {
            switch (err.statusCode) {
                case 422:
                    return 500;
                case 400:
                    return 500;
                default:
                    return err.statusCode;
            }
        }
        
    } else if (err instanceof AppError) {
        return err.statusCode;
    }
    return 500;
}

function authErrToCode(err: Error) {
    if(err instanceof NetworkError) {
        switch(err.name) {
            case ErrName.aborted:
                return ErrCode.aborted;
            case ErrName.parse:
                return 500;
            case ErrName.timeout:
                return ErrCode.timeout;
            case ErrName.unknown:
                return 500;
            case ErrName.unreachable:
                return ErrCode.unreachable;
        }
        if (err.name === ErrName.http) {
            switch (err.statusCode) {
                case 422:
                    return 500;
                case 400:
                    return 500;
                default:
                    return err.statusCode;
            }
        }
        
    } else if (err instanceof AppError) {
        return err.statusCode;
    }
    return 500;
}

function accountErrToCode(err: Error) {
    if(err instanceof NetworkError) {
        switch(err.name) {
            case ErrName.aborted:
                return ErrCode.aborted;
            case ErrName.parse:
                return 500;
            case ErrName.timeout:
                return ErrCode.timeout;
            case ErrName.unknown:
                return 500;
            case ErrName.unreachable:
                return ErrCode.unreachable;
        }
        if (err.name === ErrName.http) {
            switch (err.statusCode) {
                case 422:
                    return 500;
                case 400:
                    return 500;
                default:
                    return err.statusCode;
            }
        }
        
    } else if (err instanceof AppError) {
        return err.statusCode;
    }
    return 500;
}

export {
    todoErrToCode,
    authErrToCode,
    accountErrToCode
}