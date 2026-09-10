import { useEffect, useState} from 'react';
import { isAxiosError } from 'axios';
import { useAuthContext, defaultUser } from '@hooks';
import { SettingsData } from '../components/index.componentTypes';
import { accountAPI } from '@/apis/apis.index';

type ProfileType = SettingsData.ProfileFormType;
type PasswordType = SettingsData.PasswordFormType;
type UsernameType = SettingsData.UsernameFormType;

function handleError(err: any) {
    if (isAxiosError(err)) {
        if (err.response) {
            return err.response.status;
        }
        return err.request?.status;
    }
    return 500;
}

function useAccount() {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const {user, setUser} = useAuthContext();

    useEffect(() => {
        if (user.userId ==='guest') {
            setProfile(null);
            return;
        }
        accountAPI.get<{message: string, user: ProfileType}>('/').then((res) => {
            setProfile(res.data.user);
        }).catch((err) => {
            handleError(err);
        })
    }, [user]);

    async function updateProfile(updateData: ProfileType) {
        try {
            const res = await accountAPI.patch<{message: string, user: ProfileType}>('/', updateData);
            setProfile(res.data.user);
            return res.status;
        } catch(err:any) {
            return handleError(err);
        }
    }

    async function updateUsername(updateData: UsernameType) {
        try {
            const res = await accountAPI.put('/username', updateData);
            return res.status;
        } catch(err: any) {
            return handleError(err);
        }
    }

    async function updatePassword(updateData: PasswordType) {
        try {
            const res = await accountAPI.put('/password', updateData);
            setUser(defaultUser);
            return res.status;
        } catch(err: any) {
            return handleError(err);
        }
    }

    return {profile, updateProfile, updateUsername, updatePassword};
}

export default useAccount;