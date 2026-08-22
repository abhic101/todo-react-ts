import { createContext, type ReactNode, useMemo} from 'react';
import { useTodo } from '@hooks'

interface Props { 
    children: ReactNode;
}

type ContextType = ReturnType<typeof useTodo>;

const TodoContext = createContext<ContextType | null>(null);

function TodoProvider ({children}: Props) {
    const todoState = useTodo();
    const memoizedTodoState = useMemo<ContextType>(() => todoState, [todoState.todoList]);

    return (
        <TodoContext value={memoizedTodoState}>
            {children}
        </TodoContext>
    )
}

export {
    TodoProvider,
    TodoContext
};