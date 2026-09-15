import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Profile, type Username, type Password, defaultUser } from '@api';
import { AccountFn } from '@repositories/repository.index';
export function useGetAccount() {
    return useQuery({
        queryKey: ['account'],
        queryFn: AccountFn.getAccount,
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
}

export function useUpdateProfile() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (profileUpdate: Profile) => AccountFn.updateProfile(profileUpdate),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['account']});
            client.invalidateQueries({queryKey: ['user']});
        }
    })
}

export function useUpdateUsername() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (usernameUpdate: Username) => AccountFn.updateUsername(usernameUpdate),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['account']});
            client.invalidateQueries({queryKey: ['user']});
        }
    })
}

export function useUpdatePassword() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (passwordUpdate: Password) => AccountFn.updatePassword(passwordUpdate),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['user']});
            client.invalidateQueries({queryKey: ['account']});
            client.setQueryData(['todos'], []);
        }
    })
}

export type {
    Profile,
    Username,
    Password
}