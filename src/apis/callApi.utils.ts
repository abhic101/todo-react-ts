import  { type AxiosInstance, isAxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { authEndpoints } from './auth.api';
import { todoEndpoints } from './todo.api';
import { accountEndpoints } from './account.api';
import type { AvailableEndpoints, AvailableEndpointsName } from './apis.index';
import type {HTTPMethod} from './apis.types';
import { NetworkError, InvalidArgError, AppError, mapAxiosError } from '@errors';

const MAX_RETRIES = 5;

type EndpointArg = {
    method: HTTPMethod
    endpointName: AvailableEndpointsName,
    endpointParams?: string[];
}

async function callApi (
    apiInstance: AxiosInstance,
    {
        method,
        endpointName,
        endpointParams,
    }: EndpointArg,
    data: any = undefined,
    config: AxiosRequestConfig | undefined = undefined
) {
    const baseURL = apiInstance.getUri();
    const feature = baseURL.split('/')[3];

    // Selecting endpoint map
    let endpointsMap: AvailableEndpoints;
    if (feature === 'auth') endpointsMap = authEndpoints;
    else if (feature === 'account') endpointsMap = accountEndpoints;
    else endpointsMap = todoEndpoints;

    // Validating method and endpoint
    const endpointKeys  = Object.keys(endpointsMap);
    let endpointFound = false;
    for (let key of endpointKeys) {
        if (key === endpointName) {
            endpointFound = true;
            break;
        }
    }

    // If endpoint is invalid
    if (!endpointFound) {
        // Throw here
        throw new InvalidArgError('Invalid endpoint for this api');
    }

    // Validate method
    const endpoint = endpointsMap[endpointName];
    const isMethodAllowed = endpoint?.methods.find((m) => m === method);
    if (!isMethodAllowed) {
        // Throw here
        throw new InvalidArgError('Invalid method for this api endpoint');
    }

    // Validate path string
    const pathFormat = endpoint?.path as string;
    const pathFormatArr = pathFormat.split('/');
    let requiredParams = 0;
    pathFormatArr.forEach((val) => {val === '*' && requiredParams++});
    let path: string;
    if (!requiredParams) {
        path = endpoint?.path as string;
    } else {
        if (requiredParams !== endpointParams?.length) {
            throw new InvalidArgError('Please provide params for dynamic path');
        }
        path = buildPathString(pathFormatArr, endpointParams, requiredParams);
    }
    


    // Request is valid
    let requestCounter = 0;
    let err: NetworkError = new NetworkError('Temp');
    while(requestCounter < MAX_RETRIES) {
        const res: AxiosResponse | Error = await callApiHelper(apiInstance, method, path, data, config);
        if (!(res instanceof Error)) {
            return res;
        }
        if (!isAxiosError(res)) {
            throw new AppError('Application Error', {cause: res});
        } else {
            err = mapAxiosError(res);
            if (!err.isRetryable) {
                throw err;
            };
        }
        requestCounter++;
    }
    throw err;
}

async function callApiHelper(apiInstance: AxiosInstance, method: HTTPMethod, endpointPath: string, data: any, config: any) {
    try {
        const res = await apiInstance[method](endpointPath, data, config);
        return res;
    } catch(err: any) {
        return err;
    }
}

function buildPathString(pathFormat: string[], params: string[], count: number) {
    const finalPath = pathFormat.map((val) => {
        if (val === '*') {
            return params[params.length - count--];
        }
    })
    return finalPath.join('/');
}

export default callApi;