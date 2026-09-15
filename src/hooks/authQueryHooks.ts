import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import { type User, defaultUser } from '@api';
import { AuthFn } from '@repositories/repository.index'
import { SignupData } from '@/components/index.componentTypes';

export function useMe() {
    return useQuery({
        queryKey: ['user'],
        queryFn: AuthFn.getMe,
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
};

export function useLogin() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (userData: {username: string, password:string}) => AuthFn.login(userData),
        retry: false,
        onSuccess: async (data) => {
            client.invalidateQueries({queryKey: ['account']});
            client.invalidateQueries({queryKey: ['user']});
            client.invalidateQueries({queryKey: ['todos']});
        },
    })
}

export function useLogout() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: () => AuthFn.logout(),
        onSuccess: async () => {
            client.invalidateQueries({queryKey: ['user']});
            client.invalidateQueries({queryKey: ['todos']});
        }
    })
}

export function useSignup() {
    return useMutation({
        mutationFn: (signupData: SignupData.FormData) => AuthFn.signup(signupData)
    })
}

export function useCheckUsername() {
    return useMutation({
        mutationFn: (username: string) => AuthFn.checkUsername(username)
    })
}

export type {User}
export {defaultUser}