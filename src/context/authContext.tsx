import { createContext, useMemo, type ReactNode } from 'react';
import { useAuth } from '@hooks';

interface Props {
    children: ReactNode;
}

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

function AuthProvider ({children}: Props) {
    const authState = useAuth();
    
    const memoizedAuthState = useMemo(() => authState, [authState.user, authState.hasUserChanged]);

    return (
        <AuthContext.Provider value={memoizedAuthState}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider,
    AuthContext
}