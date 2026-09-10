import { useState, useEffect, useRef } from 'react';
import { todoAPI, callApi } from '@api';
import { NetworkError, AppError, StatusCodeMap as ErrCode, ErrorKindName as ErrName } from '@errors';
import { useAuthContext } from '@hooks';
import { TodoData } from '../components/index.componentTypes'

type TodoTask = TodoData.TodoTask;

// Todo error handler for this hook
function handleTodoErrors(err: any) {
    if(err instanceof NetworkError) {
        switch(err.name) {
            case ErrName.aborted:
                return ErrCode.aborted;
            case ErrName.parse:
                return 500;
            case ErrName.timeout:
                return ErrCode.timeout;
            case ErrName.unknown:
                return 500;
            case ErrName.unreachable:
                return ErrCode.unreachable;
        }
        if (err.name === ErrName.http) {
            switch (err.statusCode) {
                case 422:
                    return 500;
                case 400:
                    return 500;
                default:
                    return err.statusCode;
            }
        }
        
    } else if (err instanceof AppError) {
        return err.statusCode;
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
                try {
                    const localList = JSON.parse(localListString) as TodoTask[];
                    setTodoList(localList);
                    todoListRef.current = localList;
                } catch {
                    setTodoList([]);
                }
            } else {
                setTodoList([]);
            }
            setShowSaveListDialog(false);
            setUnsavedTodoList([]);
            setHasUserChanged(false);
            return;
        }

        // Transitioned from guest to registered user: check for local guest tasks to merge
        const localListString = localStorage.getItem('todoList');
        let localTasks: TodoTask[] = [];
        if (localListString) {
            try {
                localTasks = JSON.parse(localListString) as TodoTask[];
            } catch {
                localTasks = [];
            }
        }
        if (localTasks.length === 0 && todoListRef.current.length > 0) {
            localTasks = todoListRef.current;
        }

        if (localTasks.length > 0) {
            setUnsavedTodoList(localTasks);
            setShowSaveListDialog(true);
        }

        callApi(todoAPI, { method: 'get', endpointName: 'TODO' })
            .then((res) => {
                const serverTasks: TodoTask[] = res.data.tasks || [];
                setTodoList(serverTasks.sort((a, b) => (a.status === b.status ? 0 : a.status ? 1 : -1)));
                setHasUserChanged(false);
            })
            .catch(() => {
                setHasUserChanged(false);
            });
    }, [user.userId]);

    useEffect(() => {
        todoListRef.current = todoList;
    }, [todoList]);

    // Save guest todos whenever todoList changes in guest mode
    useEffect(() => {
        if (user.userId === 'guest') {
            localStorage.setItem('todoList', JSON.stringify(todoList));
        }
    }, [todoList, user.userId]);

    async function addTask(task: Omit<TodoTask, "status" | "_id">) {
        try {
            if (user.userId === 'guest') {
                const newTask: TodoTask = {
                    task_name: task.task_name,
                    task_details: task.task_details,
                    status: false,
                    _id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
                };
                setTodoList((prev) => [newTask, ...prev]);
                return 201;
            }
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
                    return {
                        ...t,
                        status: task.status,
                        task_details: task.task_details,
                        task_name: task.task_name
                    };
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
                await callApi(todoAPI, {method: 'delete', endpointName: 'SINGLE_TASK', endpointParams: [task._id as string]});
            }
            setTodoList((prev) => prev.filter((t) => t._id !== task._id));
            return 200;
        } catch(err) {
            return handleTodoErrors(err);
        }
    }

    async function mergeUnsavedList() {
        try {
            if (user.userId === 'guest') return 200;
            if (unsavedTodoList.length === 0) {
                setShowSaveListDialog(false);
                return 200;
            }
            const tasksToMerge = unsavedTodoList.map(({ task_name, task_details, status }) => ({
                task_name,
                task_details: task_details || '',
                status: !!status
            }));
            const res = await callApi(todoAPI, {method: 'post', endpointName: 'BATCH'}, {tasks: tasksToMerge});
            
            const mergedTasks: TodoTask[] = res.data.tasks || [];
            setTodoList((prev) => [...prev, ...mergedTasks].sort((a, b) => (a.status === b.status ? 0 : a.status ? 1 : -1)));
            setUnsavedTodoList([]);
            setShowSaveListDialog(false);
            localStorage.removeItem('todoList');
            return 201;
        } catch(err) {
            return handleTodoErrors(err);
        }
    }

    function cancelMerge() {
        setUnsavedTodoList([]);
        setShowSaveListDialog(false);
        localStorage.removeItem('todoList');
    }

    return { todoList, showSaveListDialog, setShowSaveListDialog, addTask, updateTask, deleteTask, mergeUnsavedList, cancelMerge };
}

export default useTodoList;
export type {
    TodoTask
};