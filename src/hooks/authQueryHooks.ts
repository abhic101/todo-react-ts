import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import { AuthQueries, type User, defaultUser } from '@api';
import { SignupData } from '@/components/index.componentTypes';

export function useMe() {
    return useQuery({
        queryKey: ['user'],
        queryFn: AuthQueries.getMe,
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
};

export function useLogin() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (userData: {username: string, password:string}) => AuthQueries.login(userData),
        retry: false,
        onSuccess: (data) => {
            client.setQueryData(['user'], data);
            client.invalidateQueries({queryKey: ['todos']});
            client.invalidateQueries({queryKey: ['account']});
        },
    })
}

export function useLogout() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: () => AuthQueries.logout(),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['user']});
            client.setQueryData(['todos'], []);
        }
    })
}

export function useSignup() {
    return useMutation({
        mutationFn: (signupData: SignupData.FormData) => AuthQueries.signup(signupData)
    })
}

export function useCheckUsername() {
    return useMutation({
        mutationFn: (username: string) => AuthQueries.checkUsername(username)
    })
}

export type {User}
export {defaultUser}