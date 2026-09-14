import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { TodoQueries, type Task } from '@api';

function useGetAllTask() {
    return useQuery({
        queryKey: ['todos'],
        queryFn: TodoQueries.getAllTask,
        retry: false
    })
}

function useAddOneTask() {
    const queryClient = useQueryClient();
    const controller = new AbortController();
    return useMutation({
        mutationFn: (task: Task) => TodoQueries.addOneTask(task, controller),
        retry: false,
        onSuccess: (data) => {
            queryClient.setQueryData(['todos'], (oldTodos: Task[]) => [data, ...oldTodos])
        }
    });
}

function useAddManyTask() {
    const queryClient = useQueryClient();
    const controller = new AbortController();
    return useMutation({
        mutationFn: (tasks: Task[]) => TodoQueries.addManyTask(tasks, controller),
        retry: false,
        onSuccess: (data) => {
            queryClient.setQueryData(['todos'], (oldTodos: Task[]) => [...data, ...oldTodos])
        }
    })
}

function useUpdateOneTask() {
    const queryClient = useQueryClient();
    const controller = new AbortController();
    return useMutation({
        mutationFn: (task: Task) => TodoQueries.updateOneTask(task, controller),
        retry: false,
        onSuccess: (data, task) => {
            queryClient.setQueryData(['todos'], (oldTodos: Task[]) => oldTodos.map((t) => {
                if (t._id === task._id) return task;
                return t;
            }))
        }
    })
}

function useDeleteOneTask() {
    const queryClient = useQueryClient();
    const controller = new AbortController();
    return useMutation({
        mutationFn: (task: Task) => TodoQueries.deleteOneTask(task, controller),
        retry: false,
        onSuccess: (data, task) => {
            queryClient.setQueryData(['todos'], (oldTodos: Task[]) => oldTodos.filter((t) => t._id !== task._id))
        }
    })
}

export {
    useGetAllTask,
    useAddOneTask,
    useAddManyTask,
    useUpdateOneTask,
    useDeleteOneTask,
    type Task
}