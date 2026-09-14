import { isAuthEndpointIndempotent } from './auth/auth.api';
import { isTodoEndpointIndempotent } from './todo/todo.api';
import { isAccountEndpointIndempotent } from './account/account.api';
import type { HTTPMethod } from './apis.types';

function isIndempotent(baseURL: string | null, endpointPath: string | null, method: HTTPMethod | null) {
    
    // If the args are is invalid, throw app error here
    if (!baseURL || !endpointPath || !method) return false;

    // For valid values
    const feature = baseURL.split('/')[3]
    if (feature === 'auth') {
        return isAuthEndpointIndempotent(endpointPath, method);
    }
    if (feature === 'todo') {
        return isTodoEndpointIndempotent(endpointPath, method);
    }
    if (feature === 'account') {
        return isAccountEndpointIndempotent(endpointPath, method);
    }

    // Fallback
    return false;
}

export {
    isIndempotent
}