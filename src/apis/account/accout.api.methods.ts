import {isAxiosError} from 'axios';
import { accountAPI, accountEndpoints as apiMap } from './account.api';
import type { Profile, Username, Password } from './account.api';
import { mapAxiosError } from '@errors'; 

export async function getAccount() {
    try {
        const res = await accountAPI.get<{user: Profile}>(apiMap.ACCOUNT.path);
        return res.data.user;
    } catch (err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

export async function updateProfile(profileUpdate: Profile) {
    try {
        const res = await accountAPI.patch<{user: Profile}>(apiMap.ACCOUNT.path, profileUpdate);
        return res.data.user;
    } catch(err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

export async function updatePassword(passwordUpdate: Password) {
    try {
        await accountAPI.put(apiMap.PASSWORD.path, passwordUpdate);
    } catch (err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

export async function updateUsername(usernameUpdate: Username) {
    try {
        await accountAPI.put(apiMap.USERNAME.path, usernameUpdate);
    } catch(err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}