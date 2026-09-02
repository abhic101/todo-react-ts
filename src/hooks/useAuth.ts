import { useState, useEffect } from 'react';
import { authAPI } from '@api';
import {isAxiosError} from 'axios';
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

function useAuth() {
    const [user, setUser] = useState<User>(() => defaultUser);
    const [hasUserChanged, setHasUserChanged] = useState<boolean>(true);

    useEffect(() => {
        authAPI.get('/me').then((res) => {
            setHasUserChanged(true);
            setUser(res.data.user);
        }).catch((err) => {
            if (isAxiosError(err)) {
                if (err.response) return;
                console.log("Request Error Code: " + err.request?.status);
                console.error('Error Details: ', err);
            }
        })
    }, []);

    function handleAxiosErrors(err: any) {
        console.log('Status code: ', err.response?.status);
        console.log('Message: ', err.response?.data?.message);
        if (err.response?.status === 401) {
            setUser({...defaultUser});
        }
    }

    async function login(username: string, password: string): Promise<InvalidFieldToComponent | number> {
        try {
            const res = await authAPI.post('/login', {
                username,
                password
            });
            setHasUserChanged(true);
            setUser(res.data.user);
            
            return 201;
        } catch(err: any) {
            if(isAxiosError(err)) {
                handleAxiosErrors(err);
                return {
                    statusCode: err.response?.status ? err.response?.status : 1000,
                    field: err.response?.data.field
                }
            } else {
                console.error('Error Occurred at GetList: ', err);
            }
        }
        return 1000;
    }

    async function logout() {
        try {
            authAPI.post('/logout');
            setUser({...defaultUser});
        } catch(err) {
            handleAxiosErrors(err);
        }
    }

    async function signup(signupFormData: SignupFormData): Promise<InvalidFieldToComponent | number> {
        try {
            const res = await authAPI.post('/signup', signupFormData);
            return res.status;
        } catch(err) {
            handleAxiosErrors(err);
            if (isAxiosError(err)) {
                return {
                    statusCode: err.response?.status ? err.response?.status : 1000,
                    field: err.response?.data.details[0].field
                }
            }
        }
        return 1000;
    }

    async function checkUsername(username: string): Promise<number> {
        try {
            const res = await authAPI.post('/username-availability', {username});
            return res.status;
        } catch(err: any) {
            if (isAxiosError(err)) {
                handleAxiosErrors(err);
            }
            return err.response ? err.response.status : 500;
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