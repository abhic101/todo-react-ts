import  { type AxiosInstance, isAxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { authEndpoints } from './auth.api';
import { todoEndpoints } from './todo.api';
import { accountEndpoints } from './account.api';
import type { AvailableEndpoints, AvailableEndpointsName } from './apis.index';
import type {HTTPMethod} from './apis.types';
import { NetworkError, InvalidArgError, AppError, mapAxiosError } from '@errors';

const MAX_RETRIES = 5;

async function callApi(apiInstance: AxiosInstance, method: HTTPMethod, endpointName: AvailableEndpointsName, data: any = undefined, config: AxiosRequestConfig | undefined = undefined) {
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

    // Request is valid
    let requestCounter = 0;
    let err: NetworkError = new NetworkError('Temp');
    while(requestCounter < MAX_RETRIES) {
        const res: AxiosResponse | Error = await callApiHelper(apiInstance, method, endpoint?.path as string, data, config);
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
        console.log('Retry: ' + requestCounter);
        console.log(err);
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

export default callApi;