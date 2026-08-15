import {isAxiosError} from 'axios';
import { useState, useEffect } from 'react';
import { todoAPI } from '@api';
import { useAuthContext, defaultUser } from '@hooks';
import { TodoData } from '../components/index.componentTypes'

type TodoTask = TodoData.TodoTask;

function useTodoList() {
    const [todoList, setTodoList] = useState<TodoTask[]>([]);
    const [user, setUser] = useAuthContext();

    useEffect(() => {
        if (user.userId === 'guest') {
            setTodoList([]);
            return;
        };
        todoAPI.get<{message: string, tasks: TodoTask[]}>('/').then((res) => {
            console.log(res.data.tasks);
            setTodoList(res.data.tasks.sort((a, b) => {b;return a.status ? 1 : -1}));
        }).catch((err) => {
            if(isAxiosError(err)) {
                console.log('Status code sent: ', err.response?.status);
                console.log('Message: ', err.response?.data?.message);
                console.error("axiosError: ", err);
                if (err.response?.status === 401) {
                    setUser({...defaultUser});
                }
            } else {
                console.error('Error Occurred at GetList: ', err);
            }
        })
    }, [user]);

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
            const res = await todoAPI.post('/', task);
            setTodoList((prev) => [...prev, res.data.task]);
            return res.status;
        } catch(err) {
            handleTodoErrors(err);
        }
    }

    async function updateTask(task: TodoTask) {
        try {
            await todoAPI.patch(`/${task._id}`, task);
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
            await todoAPI.delete(`/${task._id}`);
            setTodoList((prev) => prev.filter((t) => t._id !== task._id));
        } catch(err) {
            handleTodoErrors(err);
        }
    }

    return [ todoList, addTask, updateTask, deleteTask] as const;
}

export default useTodoList;
export type {
    TodoTask
};