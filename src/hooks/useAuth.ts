import { useState, useEffect } from 'react';
import { authAPI, callApi  } from '@/apis/apis.index';
import { NetworkError, AppError, ErrorKindName as ErrName, StatusCodeMap as ErrCode} from '@errors';
import { SignupData } from '../components/index.componentTypes';

type SignupFormData = SignupData.FormData;

interface User {
    userId: string;
    firstname: string;
    username: string;
}

interface InvalidFieldToComponent {
    statusCode: number;
    field: string;

}

const defaultUser = {
    userId: 'guest',
    firstname: 'Guest',
    username: 'guest'
}

// Todo error handler for this hook
function handleAuthErrors(err: any) {
    if(err instanceof NetworkError) {
        switch(err.name) {
            case ErrName.aborted:
                return ErrCode.aborted;
            case ErrName.parse:
                return 500;
            case ErrName.timeout:
                return ErrCode.timeout;
            case ErrName.unknown:
                return 500;
            case ErrName.unreachable:
                return ErrCode.unreachable;
        }
        if (err.name === ErrName.http) {
            switch (err.statusCode) {
                case 422:
                    return 500;
                case 400:
                    return 500;
                default:
                    return err.statusCode;
            }
        }
        
    } else if (err instanceof AppError) {
        return err.statusCode;
    }
    return 500;
}

function useAuth() {
    const [user, setUser] = useState<User>(() => defaultUser);
    const [hasUserChanged, setHasUserChanged] = useState<boolean>(true);

    useEffect(() => {
        authAPI.get('/me').then((res) => {
            setHasUserChanged(true);
            setUser(res.data.user);
        }).catch(() => {
        })
    }, []);

    async function login(username: string, password: string) {
        try {
            const res = await callApi(authAPI, {
                method: 'post',
                endpointName: 'LOGIN'
                }, {
                    username, password
                })
            setHasUserChanged(true);
            setUser(res.data.user);
            return 200;
        } catch(err: any) {
            return handleAuthErrors(err);
        }
            
    }

    async function logout() {
        try {
            await callApi(authAPI, {method: 'post', endpointName: 'LOGOUT'});
            setUser({...defaultUser});
            return 200;
        } catch(err) {
            return handleAuthErrors(err);
        }
    }

    async function signup(signupFormData: SignupFormData) {
        try {
            await callApi(authAPI, {
                method: 'post',
                endpointName: 'SIGNUP'
            }, signupFormData);
            return 201;
        } catch(err) {
            return handleAuthErrors(err);
        }
    }

    async function checkUsername(username: string) {
        try {
            await callApi(authAPI, {
                method: 'post',
                endpointName: 'USERNAME_AVAILABILITY'
            }, {username});
            return 200;
        } catch(err: any) {
            return handleAuthErrors(err);
        }
    }

    return {user, hasUserChanged, setUser, setHasUserChanged, login, logout, signup, checkUsername} as const;
}

export default useAuth;
export {
    defaultUser,
    type User,
    type InvalidFieldToComponent
}