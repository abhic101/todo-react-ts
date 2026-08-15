import { useEffect, useState} from 'react';
import { isAxiosError } from 'axios';
import { useAuthContext, defaultUser } from '@hooks';
import { SettingsData } from '../components/index.componentTypes';
import { accountApi } from '@api';

type ProfileType = SettingsData.ProfileFormType;
type PasswordType = SettingsData.PasswordFormType;
type UsernameType = SettingsData.UsernameFormType;

function handleError(err: any) {
    if (isAxiosError(err)) {
        if (err.response) {
            console.error('Axios Error: ', err.response.status, err.response.data?.message);
            console.log(err.response.status)
            return err.response.status;
        }
        console.error('Axios RequestError: ', err.request?.status, err);
        return err.request?.status;
    }
    console.error("Unknown Error", err );
    return 500;
}

function useAccount() {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [user, setUser] = useAuthContext();

    useEffect(() => {
        if (user.userId ==='guest') {
            setProfile(null);
            return;
        }
        accountApi.get<{message: string, user: ProfileType}>('/').then((res) => {
            setProfile(res.data.user);
        }).catch((err) => {
            handleError(err);
        })
    }, [user]);

    async function updateProfile(updateData: ProfileType) {
        try {
            const res = await accountApi.patch<{message: string, user: ProfileType}>('/', updateData);
            setProfile(res.data.user);
            return res.status;
        } catch(err:any) {
            return handleError(err);
        }
    }

    async function updateUsername(updateData: UsernameType) {
        try {
            const res = await accountApi.put('/username', updateData);
            return res.status;
        } catch(err: any) {
            return handleError(err);
        }
    }

    async function updatePassword(updateData: PasswordType) {
        try {
            const res = await accountApi.put('/password', updateData);
            setUser(defaultUser);
            return res.status;
        } catch(err: any) {
            return handleError(err);
        }
    }

    return {profile, updateProfile, updateUsername, updatePassword};
}

export default useAccount;