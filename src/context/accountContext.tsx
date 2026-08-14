import { createContext, type ReactNode, useMemo } from 'react';
import { useAccount } from '@hooks';

const AccountContext = createContext<ReturnType<typeof useAccount> | null>(null);

function AccountProvider({children}: {children: ReactNode}) {
    const state = useAccount();
    const memoizedState = useMemo(() => state, [state.profile]);

    return (
        <AccountContext.Provider value={memoizedState}>
            {children}
        </AccountContext.Provider>
    )
}

export {
    AccountContext,
    AccountProvider
}