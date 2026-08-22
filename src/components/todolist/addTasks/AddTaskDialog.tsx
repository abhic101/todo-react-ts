import { useState, type CSSProperties } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTodoContext } from '@hooks';
import { RichTextEditor } from '@components';
import { FaTimes as CloseIcon,FaPlus as AddIcon, FaRegSave as SaveIcon  } from "react-icons/fa";
import { addTaskSchema, type FormData } from './addTasks.data'
import type { TodoTask } from '../todolist.data';
import styles from './AddTaskDialog.module.css';
import addTaskLogo from '@assets/main-app-logo.png'

interface Props {
    task?: TodoTask;
    onClose: () => void;
}

function AddTaskDialog({task, onClose}: Props) {
    const [httpNotif, setHttpNotif] = useState<string | null>(null);
    const { addTask, updateTask } = useTodoContext();
    const {
        register, control, handleSubmit, formState: {isSubmitting, errors}
    } = useForm<FormData>({
        resolver: zodResolver(addTaskSchema),
        mode: 'onSubmit'
    })

    async function onSubmit(data: FormData) {
        let updateRes: number | undefined = 100;
        if (task) {
            const newTask = {...task, task_name: data.task_name, task_details: data.task_details}
            updateRes = await updateTask(newTask);
        }
        else {
            updateRes = await addTask(data);
        }

        if (!updateRes) {
            setHttpNotif("Internal Server Error");
        }
        else if (updateRes === 201 || updateRes === 200){
            setHttpNotif('Task Added Successfully');
            await new Promise((resolve) => {setTimeout(resolve, 1000)})
            onClose();
        }
    }

    const borderColorOnError = (field: keyof FormData) => {
        if (errors[field]) {
            return {'border': '2px solid var(--input-error-border-color)'} as CSSProperties;
        }
        return {'border': '2px solid transparent'} as CSSProperties;
    }

    return (

            <div className={'dialog-root ' + styles["addtask-root"] + ' ' + (isSubmitting ? styles['disabled']: '')} >
            
{/* Header, subheader and logo section */}
            <div className={'dialog-logo-container ' + styles["addtask-logo-container"]}>
                <img className={'dialog-logo ' + styles['addtask-logo']} src={addTaskLogo} alt='login-logo' />
                <p className={'dialog-header ' + styles["addtask-header"]}>{task ? 'Edit Task' : 'Add New Task'}</p>
            </div>

{/* From starts here */}
            <form className={styles["addtask-form"]} onSubmit={handleSubmit(onSubmit)} >
 
    {/* Task name input group */}
                <div className={'dialog-input-group ' + styles["addtask-input-group"]}>

                    <div className={`dialog-input-label-error`} >
                        
                        <p className={'dialog-input-label ' + styles["login-input-label"]}>Task Name</p>

                        {errors.task_name? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.task_name.message}
                        </p>
                        )  : <></>}

                    </div>
                    
                    <input {...register('task_name', {value:task? task.task_name : ''})} className={'dialog-text-input ' + styles["addtask-text-input"]}  placeholder='Enter Task Name' disabled={isSubmitting} autoFocus style={borderColorOnError('task_name')} autoComplete="off" />
                </div>

    {/* Task details input group */}
                <div className={'dialog-input-group ' + styles["addtask-input-group"]}>

                    <div className={`dialog-input-label-error`} >

                        <p className={'dialog-input-label ' + styles["login-input-label"]}>
                        Task Details
                    </p>

                        {errors.task_details? (
                            <p className={'dialog-input-error-message ' + styles['input-error-message']}>
                            {errors.task_details.message}
                        </p>
                        )  : null}

                    </div>
                    
                    <div className={styles['add-task-details']} >
                        <RichTextEditor task={task || undefined} control={control} name='task_details' rules={{}}/>
                   </div>
                </div>

                {isSubmitting ? 
                    <div className={styles.loader} >
                        <span className={'dialog-submit-loader ' + styles['submit-loader']} ></span> 
                    </div>
                    :
                    <div className={styles['button-group']}>

                        <button className={styles["cancel-button"]} onClick={(e)=>{e.preventDefault();onClose()}} disabled={isSubmitting}>
                            <span>
                                <span className={styles['close-icon']} ><CloseIcon /></span>
                                <span className={styles['button-label']}> Discard</span>
                            </span>
                        </button>

                        <button className={styles["addtask-submit-button"]} type="submit" disabled={isSubmitting}>{ task ?
                            <span>
                                <span className={styles['save-icon']}><SaveIcon /></span>
                                <span className={styles['button-label']}>Save</span>
                            </span>
                            :
                            <span>
                                <span className={styles['save-icon']}><AddIcon /></span>
                                <span className={styles['button-label']}>Add</span>
                            </span>
                        }
                        </button>
                    </div>
                }

                
            </form>


{/*Server notifications are rendered here*/}
            {httpNotif ? (
                <div key={httpNotif} className={'dialog-http-notif-container ' + styles['http-notif-container']}>
                    <p className={styles[(httpNotif === 'Task Added Successfully' ? 'http-notif-message-success' : 'http-notif-message-failure')]}>{httpNotif}</p>
                </div>
            ) : <></> }
            </div>
    )
}

export default AddTaskDialog;