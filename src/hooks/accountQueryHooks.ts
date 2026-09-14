import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountQueries, type Profile, type Username, type Password, defaultUser } from '@api';

export function useGetAccount() {
    return useQuery({
        queryKey: ['account'],
        queryFn: AccountQueries.getAccount,
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })
}

export function useUpdateProfile() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (profileUpdate: Profile) => AccountQueries.updateProfile(profileUpdate),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['account']});
            client.invalidateQueries({queryKey: ['user']});
        }
    })
}

export function useUpdateUsername() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (usernameUpdate: Username) => AccountQueries.updateUsername(usernameUpdate),
        onSuccess: () => {
            client.invalidateQueries({queryKey: ['account']});
            client.invalidateQueries({queryKey: ['user']});
        }
    })
}

export function useUpdatePassword() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: (passwordUpdate: Password) => AccountQueries.updatePassword(passwordUpdate),
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