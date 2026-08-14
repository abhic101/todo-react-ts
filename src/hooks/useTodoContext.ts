import { TodoContext } from '@context';
import { useContext } from 'react';

function useTodoContext() {
    const context = useContext(TodoContext);
    if (!context ) throw new Error('Todo context can only be used inside TodoProvider');
    return context;
}

export default useTodoContext;