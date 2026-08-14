import { useContext } from 'react';
import { AccountContext } from '@context';

function useAccountContext() {
    const context = useContext(AccountContext);
    if (context === null) {
        throw Error('Use account context inside account provider only');
    }

    return context;
}

export default useAccountContext;