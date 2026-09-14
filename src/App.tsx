import { memo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer, Header, NavbarDesktopLayout, NavbarMobileLayout, TodoList } from '@components';
import { useMediaQuery } from '@hooks';
import { BREAKPOINTS } from './styles/breakpoints';

// Memoizing static components
const MemoizedHeader = memo(Header);
const MemoizedFooter = memo(Footer);

const queryClient = new QueryClient();

function App() {

    return (
        <div id="page-wrapper">
            <MemoizedHeader />
            <QueryClientProvider client={queryClient}>
                        {useMediaQuery(BREAKPOINTS.md) ? 
                            <NavbarMobileLayout />
                            :
                            <NavbarDesktopLayout />
                        }
                    <TodoList />
            </QueryClientProvider>
            <MemoizedFooter />
        </div>
    )
}

export default App;