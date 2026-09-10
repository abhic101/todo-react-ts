import  { type AxiosError, isCancel, isAxiosError } from 'axios';
import { NetworkError } from './network.errors';
import { InvalidArgError } from './app.errors';
import { type HTTPMethod, isIndempotent } from '@api';

// Mapping of standard errors thrown by axios into network error
function mapAxiosError(err: AxiosError) {
    if (!isAxiosError(err)) {
        throw new InvalidArgError('Given error is not axios error');
    }

    const baseURL = err.config?.baseURL || null;
    const url = err.config?.url || null;
    const method = err.config?.url || null;

    // Aborted requests
    if (isCancel(err) || err.code === 'ERR_CANCELED') {
        return new NetworkError('Request Cancelled', {
            kind: 'aborted',
            isRetryable: false,
            cause: err
        });
    }

    // For request timeout
    if (err.code === 'ECONNABORTED') {
        return new NetworkError('Request Timeout', {
            kind: 'timeout',
            isRetryable: isIndempotent(baseURL, url, method as HTTPMethod),
            cause: err
        });
    }

    // No response field can mean offline, DNS errors, CORS failure
    if (!err.response) {
        return new NetworkError('Server Unreachable', {
            kind: 'unreachable',
            isRetryable: false,
            cause: err
        });
    }

    // For Server status codes 400 to 499
    const status = err.response.status;
    if (status >= 400 && status < 500) {
        return new NetworkError('Http Error', {
            kind: 'http',
            isRetryable: false,
            cause: err
        });
    }
    
    // For http status code 500
    return new NetworkError('Internal Server Error', {
        kind: 'http',
        isRetryable: isIndempotent(baseURL, url, method as HTTPMethod),
        cause: err
    })
}

export default mapAxiosError;