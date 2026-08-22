import { memo } from 'react';
import { Footer, Header, Navbar, TodoList } from '@components';
import { AuthProvider } from '@context';

// Memoizing static components
const MemoizedHeader = memo(Header);
const MemoizedFooter = memo(Footer)

function App() {

    return (
        <div id="page-wrapper">
            <MemoizedHeader />
            <AuthProvider>
                <Navbar />
                <TodoList />
            </AuthProvider>
            <MemoizedFooter />
        </div>
    )
}

export default App;