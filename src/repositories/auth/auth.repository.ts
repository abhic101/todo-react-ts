import { isAxiosError } from 'axios';
import {authAPI, authEndpoints as apiMap, type User, defaultUser} from '@api';
import { mapAxiosError } from '@errors';
import type { SignupData } from '@/components/index.componentTypes';

async function getMe() {
    try {
        const res = await authAPI.get<{user: User}>(apiMap.ME.path);
        const user = res.data.user;
        sessionStorage.setItem('user', JSON.stringify(user));
        return res.data.user;
    } catch (err: any) {
        sessionStorage.removeItem('user');
        if (isAxiosError(err)) {
            const netErr = mapAxiosError(err);
            if (netErr.statusCode === 401 || netErr.statusCode === 403) {
                sessionStorage.setItem('user', JSON.stringify(defaultUser));
                return defaultUser;
            } else {
                throw netErr;
            }
        }
        throw err;
    }
}

async function login(
    {username, password}: {username: string,password: string}
) {
    try {
        const res = await authAPI.post<{user: User}>(apiMap.LOGIN.path, {username, password});
        return res.data.user;
    } catch(err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

async function logout() {
    try {
        await authAPI.post(apiMap.LOGOUT.path);
    } catch (err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

async function signup(signupData: SignupData.FormData) {
    try {
        await authAPI.post(apiMap.SIGNUP.path, signupData);
    } catch(err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

async function checkUsername(username: string) {
    try {
        await authAPI.post(apiMap.USERNAME_AVAILABILITY.path, {username});
    } catch (err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

export {
    getMe,
    login,
    logout,
    signup,
    checkUsername
}