import {
    authAPI, authEndpoints, isAuthEndpointIndempotent,
    type User, defaultUser
} from './auth/auth.api';

import  {
    todoAPI, todoEndpoints, isTodoEndpointIndempotent,
    type Task
} from './todo/todo.api';

import {
    accountAPI, accountEndpoints, isAccountEndpointIndempotent,
    type Profile, type Username, type Password
} from './account/account.api';

import {isIndempotent} from './api.utils';

import type { HTTPMethod, Endpoint } from './apis.types';
 
// APIs Instances and their endpoints
export {
    accountAPI,
    accountEndpoints,
    authAPI,
    authEndpoints,
    todoAPI,
    todoEndpoints,
    defaultUser
};

// Utils
export {
    isAuthEndpointIndempotent,
    isTodoEndpointIndempotent,
    isAccountEndpointIndempotent,
    isIndempotent
}

// Types
export type {
    HTTPMethod,
    Endpoint,
    Task,
    User,
    Profile,
    Password,
    Username
}