type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type Endpoint = {
    path: string,
    dynamic?: boolean,
    methods: HTTPMethod[]
}

// AvailableEndpoints type is defined inside apis.index.ts

export {
    type HTTPMethod,
    type Endpoint,
}