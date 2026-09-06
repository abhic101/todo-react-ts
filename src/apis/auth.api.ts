import axios from 'axios';
import type { HTTPMethod, Endpoint } from "./apis.types";

const authAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

const authEndpoints = {
    ME: {
        path: '/me',
        methods: ['get'] as HTTPMethod[]
    } as Endpoint,
    LOGIN: {
        path: '/login',
        methods: ['post'] as HTTPMethod[]
    } as Endpoint,
    LOGOUT: {
        path: '/logout',
        methods: ['post'] as HTTPMethod[]
    } as Endpoint,
    SIGNUP: {
        path: '/signup',
        methods: ['post'] as HTTPMethod[]
    } as Endpoint,
    USERNAME_AVAILABILITY: {
        path: '/username-availability',
        methods: ['post'] as HTTPMethod[]
    } as Endpoint
}

function isAuthEndpointIndempotent(endpointPath: string, method: HTTPMethod) {
    if (method === 'get') return true;
    if (method === 'delete') return false;
    switch(endpointPath) {
        case authEndpoints.LOGIN.path:
            return true;
        case authEndpoints.LOGOUT.path:
            return true;
        case authEndpoints.SIGNUP.path:
            return false;
        case authEndpoints.ME.path:
            return true;
        case authEndpoints.USERNAME_AVAILABILITY.path:
            return true;
    }
    
    // Fallback
    return false;
}

export {
    authAPI,
    authEndpoints,
    isAuthEndpointIndempotent
}