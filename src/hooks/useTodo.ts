import {isAxiosError} from 'axios';
import { useState, useEffect, useRef } from 'react';
import { todoAPI } from '@api';
import { useAuthContext, defaultUser } from '@hooks';
import { TodoData } from '../components/index.componentTypes'

type TodoTask = TodoData.TodoTask;

function useTodoList() {
    const {user, setUser, setHasUserChanged} = useAuthContext();
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

    // Todo error handler for this hook
    function handleTodoErrors(err: any) {
        if(isAxiosError(err)) {
            console.log('Status code: ', err.response?.status);
            console.log('Message: ', err.response?.data?.message);
            if (err.response?.status === 401) {
                setUser({...defaultUser});
            }
            return err.response?.status;
        } else {
            console.error('Error Occurred at GetList: ', err);
        }
        return 500;
    }


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
            const res = await todoAPI.post('/', task);
            setTodoList((prev) => [...prev, res.data.task]);
            return res.status;
        } catch(err) {
            handleTodoErrors(err);
        }
    }

    async function updateTask(task: TodoTask) {
        try {
            if (user.userId !== 'guest') {
                await todoAPI.patch(`/${task._id}`, task);
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
                await todoAPI.delete(`/${task._id}`);
            }
            setTodoList((prev) => prev.filter((t) => t._id !== task._id));
            return 200;
        } catch(err) {
            handleTodoErrors(err);
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