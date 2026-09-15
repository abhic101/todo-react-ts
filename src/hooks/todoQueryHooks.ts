import { useRef, useEffect, useState } from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { defaultUser, type Task, type User } from '@api';
import { TodoFn  } from '@repositories/repository.index'

function useGetAllTask() {
    return useQuery({
        queryKey: ['todos'],
        queryFn: TodoFn.getAllTask,
        refetchOnWindowFocus: false,
        retry: 0
    })
}

function useAddOneTask() {
    const controller = new AbortController();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (task: Task) => TodoFn.addOneTask(task, controller),
        retry: false,
        onSuccess: (data) => {
            queryClient.setQueryData(['todos'], (oldTodos: Task[]) => [data, ...oldTodos])
        }
    });
}

function useAddManyTask() {
    const controller = new AbortController();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tasks: Task[]) => TodoFn.addManyTask(tasks, controller),
        retry: false,
        onSuccess: (data) => {
            queryClient.setQueryData(['todos'], (oldTodos: Task[]) => [...data, ...oldTodos])
        }
    })
}

function useUpdateOneTask() {
    const controller = new AbortController();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (task: Task) => TodoFn.updateOneTask(task, controller),
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
    const controller = new AbortController();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (task: Task) => TodoFn.deleteOneTask(task, controller),
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
    useDeleteOneTask
};

export {
    type Task
}