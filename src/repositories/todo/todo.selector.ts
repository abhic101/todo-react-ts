import * as TodoRepository from './todo.repository';
import * as TodoLocalRepository from './todo.local.repository';
import {type Task, type User }from '@api';

function isLoggedIn() {
    const userString = sessionStorage.getItem('user');
    if (!userString) {
        return false;
    }
    const user: User = JSON.parse(userString);
    if (user.username !== 'guest') {
        return true;
    }
    return false;
}

async function getAllTask() {
    try {
        return TodoRepository.getAllTask();
    } catch(err) {
        throw err;
    }
}

async function addOneTask(task: Task, controller: AbortController) {
    try {
        if (isLoggedIn()) return TodoRepository.addOneTask(task, controller);
        return TodoLocalRepository.addOneTask(task, controller);
    } catch(err) {
        throw err;
    }
}

async function addManyTask (tasks: Task[], controller: AbortController): Promise<Task[]> {
    try {
        if (isLoggedIn()) return TodoRepository.addManyTask(tasks, controller);
        return TodoLocalRepository.addManyTask(tasks, controller);
    } catch (err) {
        throw err;
    }
}

async function updateOneTask(task: Task, controller: AbortController) {
    try {
        if (isLoggedIn()) return TodoRepository.updateOneTask(task, controller);
        return TodoLocalRepository.updateOneTask(task, controller);
    } catch(err) {
        throw err;
    }
}

async function deleteOneTask(task: Task, controller: AbortController) {
    try {
        if (isLoggedIn()) return TodoRepository.deleteOneTask(task, controller);
        return TodoLocalRepository.deleteOneTask(task, controller);
    } catch(err) {
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
