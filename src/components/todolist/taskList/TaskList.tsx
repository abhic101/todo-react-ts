import { useRef, useEffect, useState} from 'react';
import type { CSSProperties, SetStateAction, Dispatch, ChangeEvent, MouseEvent } from 'react';
import {
    useGetAllTask,
    useUpdateOneTask,
    useDeleteOneTask,
    type Task
} from '../../../hooks/todoQueryHooks';
import { ActiveModalRenderer, RenderConfirmDialog, Loader, BubbleNotif } from '@components';
import { todoErrToCode } from '@errors';
import { ModalData } from '../../index.componentTypes';
import { AiOutlineDelete , AiOutlineEdit } from "react-icons/ai";
import EmptyIcon from '@assets/empty-box.webp'
import styles from './TaskList.module.css'


type AvailableDialogs = ModalData.AvailableDialogs;

interface Props {
    activeDialog: AvailableDialogs;
    setActiveDialog: Dispatch<SetStateAction<AvailableDialogs>>;
}

function TaskList({activeDialog, setActiveDialog}: Props) {
    const [showBubbleNotif, setShowBubbleNotif] = useState<boolean>(false);
    const bubbleNotifMessage = useRef('');
    const taskRef = useRef<Task>(undefined);
    const {
        data: todos,
        isError: isTodoError,
        isLoading: isTodoLoading,
        isSuccess: isTodoSuccess,
        error: todoError,
        status: todoStatus
    } = useGetAllTask();
    const updateMutation = useUpdateOneTask();
    const deleteMutation = useDeleteOneTask();

    useEffect(() => {
        if (!activeDialog){
            taskRef.current = undefined;
        }
    }, [activeDialog]);

    useEffect(() => {
        if (updateMutation.isError) {
            const statusCode = updateMutation.error ? todoErrToCode(updateMutation.error): 500;
            setBubbleNotifMessage(statusCode);
            setShowBubbleNotif(true);
        }
        if (deleteMutation.isError) {
            const statusCode = deleteMutation.error ? todoErrToCode(deleteMutation.error): 500;
            setBubbleNotifMessage(statusCode);
            setShowBubbleNotif(true);
        }

    }, [updateMutation.isError, deleteMutation.isError])

    function markedTaskStyle(task: Task) {
        let attr = {};
        if (task.status) {
            attr = {
                style: {textDecoration:'line-through', color: 'rgba(255, 255, 255, 0.5)'} as CSSProperties
            }
        }
        return attr;
    }

    function setBubbleNotifMessage(statusCode: number) {
        switch(statusCode) {
            case 401:
                bubbleNotifMessage.current = 'Account error! Please login again';
                break;
            case 403:
                bubbleNotifMessage.current = 'Account error! Please login again';
                break;
            case 404:
                bubbleNotifMessage.current = 'Please refresh the page';
                break;
            case 605:
                bubbleNotifMessage.current = 'Server Busy. Please try again later';
                break;
            case 604:
                bubbleNotifMessage.current = 'Operation Failed! Please check your internet';
                break;
            default:
                bubbleNotifMessage.current = 'Internal Server Error';
        }
    }

    async function onToggle (e: ChangeEvent<HTMLInputElement>, task: Task) {
        const newStatus = e.target.checked;
        updateMutation.mutate({...task, status: newStatus});
    }

    async function onDelete(e: MouseEvent<HTMLButtonElement>, task: Task) {
        e.preventDefault();
        deleteMutation.mutate(task);
    }

    // async function mergerUnsavedListWrapper() {
    //     const statusCode = await mergeUnsavedList();

    //     if (statusCode === 200 || statusCode === 201) return;
    //     else {
    //         setBubbleNotifMessage(statusCode);
    //         setShowBubbleNotif(true);
    //     }
    // }

    return (
        <div className={styles['task-list-container']}>
            {isTodoLoading ? <Loader message={'Loading your tasks...'}/> : <div>
                { !todos?.length ? 
                    <div className={styles['no-task-container']}>
                        <img className={styles['no-task-image']} src={EmptyIcon} /> <span> No task found </span>
                        {/* <p className={styles['no-task-message']}>Add tasks to get started</p> */}
                    </div>
                    :
                    <ul className={styles['task-list-table']}>
                        {todos?.map((task) => {
                            return (
                                <li className={styles['task-list-item']} key={task._id}>

                                    <details className={styles['task-content-container']} >
                                        <summary className={styles['summary-box']} {...markedTaskStyle(task)} >

                                            <label className={styles["glass-checkbox"]} onClick={(e) => { e.stopPropagation(); }}>
                                                <input className={styles['task-status-checkbox']} type='checkbox' checked={task.status} onChange={(e) => onToggle(e, task)}/>
                                                <span className={styles["checkmark"]}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </span>
                                            </label>

                                            <p className={styles['task-name']}>{task.task_name}</p>

                                            <div className={styles['buttons-container']} >
                                                <button className={styles['button']} onClick={(e) => {e.preventDefault();taskRef.current = task;setActiveDialog('task-editor');}}><AiOutlineEdit className={styles['edit-icon']} /></button>
                                                <button className={styles['button']} onClick={async (e) => {await onDelete(e, task)}} ><AiOutlineDelete className={styles['delete-icon']} /></button>
                                            </div>

                                        </summary>
                                        <div className={styles['task-details']} {...markedTaskStyle(task)}><div dangerouslySetInnerHTML={{__html: task.task_details as string}} /></div>
                                    </details>

                                </li>
                            )
                        })}
                    </ul>
                }
                </div>
            }
            
            {activeDialog ? (
                <ActiveModalRenderer activeDialog={activeDialog} setActiveDialog={setActiveDialog} dialogProps={{task: taskRef.current}}>
                </ActiveModalRenderer>
                ) :
                <></>
            }
            {/* {showSaveListDialog ? (
                <RenderConfirmDialog message={"Some unsaved tasks are found in the system. Save them to account?"} onConfirm={mergerUnsavedListWrapper} onClose={cancelMerge} onCancel={cancelMerge} />
                ) :
                null
            } */}
            {showBubbleNotif && <BubbleNotif message={bubbleNotifMessage.current} onClose={() => {setShowBubbleNotif(false)}}/>}
        </div>
    )
}

export default TaskList;