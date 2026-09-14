import { isAxiosError } from 'axios';
import {todoAPI, todoEndpoints as apiMap, type Task} from './todo.api';
import  { mapAxiosError } from '@errors';



async function getAllTask(): Promise<Task[]> {
    try {
        const res = await todoAPI.get('/');
        return res.data.tasks;
    } catch (err: any) {
        if (isAxiosError(err))
            throw mapAxiosError(err);
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
        controller.abort();
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