import axios from "axios";
import type { HTTPMethod, Endpoint } from "./apis.types";

const todoAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/todo`,
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-With': 'XMLHttpRequest'
    }
});

const todoEndpoints = {
    TODO: {
        path: '/',
        methods: ['get', 'post'] as HTTPMethod[]
    } as Endpoint,
    SINGLE_TASK: {
        path: '/*',
        dynamic: true,
        methods: ['get', 'patch', 'delete'] as HTTPMethod[]
    }  as Endpoint,
    BATCH: {
        path: '/batch',
        methods: ['post'] as HTTPMethod[]
    } as Endpoint
}

function isTodoEndpointIndempotent(endpointPath: string, method: HTTPMethod) {
    if (method === 'get') return true;
    if (method === 'delete' || method === 'post') return false;
    endpointPath;

    // Fallback
    return false;
}

export {
    todoAPI,
    todoEndpoints,
    isTodoEndpointIndempotent
};