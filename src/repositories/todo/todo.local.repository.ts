import type { Task} from '@api';

async function addOneTask(task: Task, controller: AbortController) {
    const todosString = localStorage.getItem('todos');
    let todos: Task[];
    if (!todosString) {
        todos = []
    } else {
        todos = JSON.parse(todosString);
    }
    const taskWithIdAndStatus = {...task, _id: (todos.length + 1).toString(), status: false};
    const newTodos: Task[] = [taskWithIdAndStatus, ...todos];
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return taskWithIdAndStatus;
}

async function addManyTask(tasks: Task[], controller: AbortController) {
    return tasks;
}

async function updateOneTask(task: Task, controller: AbortController) {
    const todosString = localStorage.getItem('todos');
    let todos: Task[];
    if (!todosString) {
        todos = []
    } else {
        todos = JSON.parse(todosString);
    }
    const newTodos: Task[] = todos.map((t) => {
        if (t._id === task._id) t.status = task.status;
        return t;
    })
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return task;
}

async function deleteOneTask(task: Task, controller: AbortController) {
    const todosString = localStorage.getItem('todos');
    let todos: Task[];
    if (!todosString) {
        todos = []
    } else {
        todos = JSON.parse(todosString);
    }
    const newTodos: Task[] = todos.filter((t) => t._id !== task._id)
    localStorage.setItem('todos', JSON.stringify(newTodos));
    return task;
}

export {
    addOneTask,
    addManyTask,
    updateOneTask,
    deleteOneTask
}