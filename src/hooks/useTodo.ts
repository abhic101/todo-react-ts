import {isAxiosError} from 'axios';
import { useState, useEffect, useRef } from 'react';
import { todoAPI, callApi } from '@api';
import { NetworkError, AppError } from '@errors';
import { useAuthContext } from '@hooks';
import { TodoData } from '../components/index.componentTypes'

type TodoTask = TodoData.TodoTask;

// Todo error handler for this hook
function handleTodoErrors(err: any) {
    if(err instanceof NetworkError) {
        switch(err.kind) {
            case 'aborted':
                return 606;
            case 'parse':
                // Log to the logger
                console.error('Request parsing error: ', err);
                return 500;
            case 'timeout':
                return 605;
            case 'unknown':
                console.error('Unknown Network error: ', err);
                return 500;
            case 'unreachable':
                return 604;
        }
        if (err.kind === 'http') {
            switch (err.statusCode) {
                case 422:
                    console.error('Add task Schema validation failed on server: ', err);
                    return 500;
                case 400:
                    console.error('Add task bad request: ', err);
                    return 500;
                default:
                    return err.statusCode;
            }
        }
        
    } else if (err instanceof AppError) {
        console.error('Application error: ', err);
        return err.statusCode;
    } else {
        console.error('Unknown error at Api: ', err);
    }
    return 500;
}

function useTodoList() {
    const {user, setHasUserChanged} = useAuthContext();
    const [todoList, setTodoList] = useState<TodoTask[]>(() => {
        if (user.userId === 'guest') {
            const localListString = localStorage.getItem('todoList');
            if (localListString) {
                return JSON.parse(localListString) as TodoTask[];
            }
        }
        return [];
    });
    const [unsavedTodoList, setUnsavedTodoList] = useState<TodoTask[]>([]);
    const [showSaveListDialog, setShowSaveListDialog] = useState<boolean>(false);
    const todoListRef = useRef<TodoTask[]>(todoList);

    // Fetch list on mount or on user change(logout, login)
    useEffect(() => {
        // Not login - check if stored locally
        if (user.userId === 'guest') {
            const localListString = localStorage.getItem('todoList');
            if (localListString) {
                const localList = JSON.parse(localListString) as TodoTask[]
                setTodoList(localList);
                todoListRef.current = localList;
            } else {
                setTodoList([]);
            }
            setHasUserChanged(false);
            return;
        };

        todoAPI.get<{message: string, tasks: TodoTask[]}>('/').then((res) => {
            if (todoList.length !== 0 && todoList[0]._id === '1') {
                setUnsavedTodoList(todoList);
                setShowSaveListDialog(true);
            }
            setTodoList(res.data.tasks.sort((a, b) => {b;return a.status ? 1 : -1}));
            setHasUserChanged(false);
        }).catch((err) => {
            if(isAxiosError(err)) {
                console.log('Status code sent: ', err.response?.status);
                console.log('Message: ', err.response?.data?.message);
                console.error("axiosError: ", err);
            } else {
                console.error('Error Occurred at GetList: ', err);
            }
        })
    }, [user.userId]);

    useEffect(() => {
        todoListRef.current = todoList;
    }, [todoList])

    useEffect(() => {
        const saveGuestTodos = () => {
            if (user.userId === 'guest') {
            localStorage.setItem('todoList', JSON.stringify(todoListRef.current));
            }
        };

        window.addEventListener('beforeunload', saveGuestTodos);
        
        return () => {
            window.removeEventListener('beforeunload', saveGuestTodos);
            saveGuestTodos();
        };
    }, [user.userId]);


    async function addTask(task: Omit<TodoTask, "status" | "_id">) {
        try {
            if (user.userId === 'guest') {
                setTodoList((prev) => [...prev, {
                    task_name: task.task_name,
                    task_details: task.task_details,
                    status: false,
                    _id: (todoList.length + 1).toString()
                }]);
                return 201;
            }
            // const res = await todoAPI.post('/', task);
            const res = await callApi(todoAPI, {method: 'post', endpointName: 'TODO'}, task);
            setTodoList((prev) => [res.data.task, ...prev]);
            return res.status;
        } catch(err: any) {
            return handleTodoErrors(err);
        }
    }

    async function updateTask(task: TodoTask) {
        try {
            if (user.userId !== 'guest') {
                await callApi(todoAPI, {method: 'patch', endpointName: 'SINGLE_TASK', endpointParams: [task._id as string]}, task);
            }
            setTodoList((prev) => prev.map((t) => {
                if (t._id === task._id) {
                    t.status = task.status;
                    t.task_details = task.task_details;
                    t.task_name = task.task_name;
                }
                return t;
            }));
            return 200;
        } catch(err) {
            return handleTodoErrors(err);
        }
    }

    async function deleteTask(task: TodoTask) {
        try {
            if (user.userId !== 'guest') {
                await callApi(todoAPI, {method: 'patch', endpointName: 'SINGLE_TASK', endpointParams: [task._id as string]});
            }
            setTodoList((prev) => prev.filter((t) => t._id !== task._id));
            return 200;
        } catch(err) {
            return handleTodoErrors(err);
        }
    }

    async function mergeUnsavedList() {
        try {
            if (user.userId === 'guest') return;
            const res = await todoAPI.post('/batch', {tasks: unsavedTodoList});
            
            setTodoList([...todoList, ...res.data.tasks]);
            setUnsavedTodoList([]);
            setShowSaveListDialog(false);
            localStorage.removeItem('todoList');
        } catch(err) {
            handleTodoErrors(err);
        }
    }

    return { todoList, showSaveListDialog, setShowSaveListDialog, addTask, updateTask, deleteTask, mergeUnsavedList };
}

export default useTodoList;
export type {
    TodoTask
};