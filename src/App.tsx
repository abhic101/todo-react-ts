import { memo } from 'react';
import { Footer, Header, NavbarDesktopLayout, NavbarMobileLayout, TodoList } from '@components';
import { AuthProvider, AccountProvider } from '@context';
import { useMediaQuery } from '@hooks';
import { BREAKPOINTS } from './styles/breakpoints';

// Memoizing static components
const MemoizedHeader = memo(Header);
const MemoizedFooter = memo(Footer)

function App() {

    return (
        <div id="page-wrapper">
            <MemoizedHeader />
            <AuthProvider>
                <AccountProvider>
                    {useMediaQuery(BREAKPOINTS.md) ? 
                        <NavbarMobileLayout />
                        :
                        <NavbarDesktopLayout />
                    }
                </AccountProvider>
                <TodoList />
            </AuthProvider>
            <MemoizedFooter />
        </div>
    )
}

export default App;