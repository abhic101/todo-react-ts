import axios from 'axios';
import type { Endpoint, HTTPMethod} from './apis.types';

const accountAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/account`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-With': 'XMLHttpRequest'
    }
});

const accountEndpoints = {
    ACCOUNT: {
        path: '/',
        methods: ['get', 'patch'] as HTTPMethod[]
    }  as Endpoint,
    USERNAME: {
        path: '/username',
        methods: ['put'] as HTTPMethod[]
    }  as Endpoint,
    PASSWORD: {
        path: '/password',
        methods: ['put'] as HTTPMethod[]
    } as Endpoint
};

function isAccountEndpointIndempotent(url: string, method: HTTPMethod) {
    if (method === 'get') return true;
    if (method === 'put') return false;
    switch (url) {
        case accountEndpoints.ACCOUNT.path:
            return false;
    }
}

export {
    accountAPI,
    accountEndpoints,
    isAccountEndpointIndempotent
};