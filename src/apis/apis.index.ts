import { authAPI, authEndpoints, isAuthEndpointIndempotent } from './auth.api'
import  { todoAPI, todoEndpoints, isTodoEndpointIndempotent } from './todo.api'
import { accountAPI, accountEndpoints, isAccountEndpointIndempotent} from './account.api'

import callApi from './callApi.utils';
import isIndempotent from './isIndempotent.utils';

import type { HTTPMethod, Endpoint } from './apis.types';
const ALL_ENDPOINTS = {...authEndpoints, ...accountEndpoints, ...todoEndpoints};
type AvailableEndpoints = Partial<typeof ALL_ENDPOINTS>;
type AvailableEndpointsName = keyof AvailableEndpoints;
 
// APIs Instances and their endpoints
export {
    accountAPI,
    accountEndpoints,
    authAPI,
    authEndpoints,
    todoAPI,
    todoEndpoints,
};

// Utils
export {
    isAuthEndpointIndempotent,
    isTodoEndpointIndempotent,
    isAccountEndpointIndempotent,
    callApi,
    isIndempotent
}

// Types
export type {
    AvailableEndpoints,
    AvailableEndpointsName,
    HTTPMethod,
    Endpoint
}