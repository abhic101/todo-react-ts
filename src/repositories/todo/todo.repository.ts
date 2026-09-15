import { isAxiosError } from 'axios';
import {todoAPI, todoEndpoints as apiMap, type Task, type User} from '@api';
import  { mapAxiosError } from '@errors';

function getLocalTodos() {
    const todosString = localStorage.getItem('todos');
    if (!todosString) {
        return [];
    }
    const todos: Task[] = JSON.parse(todosString);
    return todos;
}

async function getAllTask(): Promise<Task[]> {
    try {
        const res = await todoAPI.get('/');
        return res.data.tasks;
    } catch (err: any) {
        if (isAxiosError(err)) {
            const netErr = mapAxiosError(err);
            if (netErr.statusCode === 401 || netErr.statusCode === 403) {
                return getLocalTodos();
            }
            throw netErr
        }
        throw err;
    }
}

async function addOneTask(task: Task, controller: AbortController): Promise<Task> {
    try {
        const res = await todoAPI.post(apiMap.TODO.path, task, {signal: controller.signal});
        return res.data.task;
    } catch (err) {
        if (isAxiosError(err))
            throw mapAxiosError(err);
        throw err;
    }
}

async function addManyTask (tasks: Task[], controller: AbortController): Promise<Task[]> {
    try {
        const res = await todoAPI.post(apiMap.BATCH.path, {tasks}, {signal: controller.signal});
        return res.data.tasks;
    } catch (err) {
        if (isAxiosError(err))  throw mapAxiosError(err);
        throw err;
    }
}

async function updateOneTask(task: Task, controller: AbortController) {
    try {
        await todoAPI.patch(apiMap.SINGLE_TASK.path + task._id, task, {signal: controller.signal});
    } catch(err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

async function deleteOneTask(task: Task, controller: AbortController) {
    try {
        await todoAPI.delete(apiMap.SINGLE_TASK.path + task._id, {signal: controller.signal});
    } catch(err) {
        if (isAxiosError(err)) throw mapAxiosError(err);
        throw err;
    }
}

export {
    getAllTask,
    addOneTask,
    addManyTask,
    updateOneTask,
    deleteOneTask
}