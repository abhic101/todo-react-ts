import { createContext, type ReactNode, useMemo} from 'react';
import { useTodo, useAuthContext } from '@hooks'

interface Props { 
    children: ReactNode;
}

type ContextType = ReturnType<typeof useTodo>;

const TodoContext = createContext<ContextType | null>(null);

function TodoProvider ({children}: Props) {
    const [todoList, addTask, updateTask, deleteTask] = useTodo();
    const memoizedTodo = useMemo<ContextType>(() => [todoList, addTask, updateTask, deleteTask], [todoList]);

    return (
        <TodoContext value={memoizedTodo}>
            {children}
        </TodoContext>
    )
}

export {
    TodoProvider,
    TodoContext
};