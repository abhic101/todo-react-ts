import { useRef, useEffect, type ReactNode, type CSSProperties, type SetStateAction, type Dispatch} from 'react';
import { useTodoContext, type TodoTask } from '@hooks';
import { ActiveModalRenderer, RenderConfirmDialog, Loader } from '@components';
import { ModalData } from '../../index.componentTypes';
import { AiOutlineDelete , AiOutlineEdit } from "react-icons/ai";
import EmptyIcon from '@assets/empty-box.webp'
import styles from './TaskList.module.css'


type AvailableDialogs = ModalData.AvailableDialogs;

interface Props {
    activeDialog: AvailableDialogs;
    setActiveDialog: Dispatch<SetStateAction<AvailableDialogs>>;
}

function TaskList({activeDialog, setActiveDialog}: Props): ReactNode {
    const {
        todoList,
        updateTask,
        isFirstMount,
        deleteTask,
        showSaveListDialog,
        setShowSaveListDialog,
        mergeUnsavedList
    } = useTodoContext();
    const taskRef = useRef<TodoTask>(undefined);

    useEffect(() => {
        if (!activeDialog){
            taskRef.current = undefined;
        }
    }, [activeDialog])

    function markedTaskStyle(task: TodoTask) {
        let attr = {};
        if (task.status) {
            attr = {
                style: {textDecoration:'line-through', 'color': 'rgba(255, 255, 255, 0.5'} as CSSProperties
            }
        }
        return attr;
    }

    return (
        <div className={styles['task-list-container']}>
            {isFirstMount ? <Loader/> : <div>
                { !todoList.length ? 
                    <div className={styles['no-task-container']}>
                        <img className={styles['no-task-image']} src={EmptyIcon} /> <span> No task found </span>
                        {/* <p className={styles['no-task-message']}>Add tasks to get started</p> */}
                    </div>
                    :
                    <ul className={styles['task-list-table']}>
                        {todoList.map((task) => {
                            return (
                                <li className={styles['task-list-item']} key={task._id}>

                                    <details className={styles['task-content-container']} >
                                        <summary className={styles['summary-box']} {...markedTaskStyle(task)} >

                                            <label className={styles["glass-checkbox"]}>
                                                <input className={styles['task-status-checkbox']} type='checkbox' checked={task.status} onChange={(e) => {updateTask({...task, status: e.target.checked})}}/>
                                                <span className={styles["checkmark"]}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </span>
                                            </label>

                                            <p className={styles['task-name']}>{task.task_name}</p>

                                            <div className={styles['buttons-container']} >
                                                <button className={styles['button']} onClick={(e) => {e.preventDefault();taskRef.current = task;setActiveDialog('task-editor');}}><AiOutlineEdit className={styles['edit-icon']} /></button>
                                                <button className={styles['button']} onClick={(e) => {e.preventDefault();deleteTask(task);}} ><AiOutlineDelete className={styles['delete-icon']} /></button>
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
            {showSaveListDialog ? (
                <RenderConfirmDialog message={"Merge unsaved todo list to your account?"} onConfirm={mergeUnsavedList} onClose={() => {setShowSaveListDialog(false)}} onCancel={() => {setShowSaveListDialog(false)}} />
                ) :
                null
            }
        </div>
    )
}

export default TaskList;