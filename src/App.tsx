import { memo } from 'react';
import { Footer, Header, NavbarDesktopLayout, NavbarMobileLayout, TodoList } from '@components';
import { AuthProvider } from '@context';
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
                {useMediaQuery(BREAKPOINTS.md) ? <NavbarMobileLayout /> : <NavbarDesktopLayout />}
                <TodoList />
            </AuthProvider>
            <MemoizedFooter />
        </div>
    )
}

export default App;