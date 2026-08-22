import { useState } from 'react';
import { ModalData } from '../index.componentTypes';
import { TodoProvider} from '@context';
import TaskList from './taskList/TaskList';
import { MdAssignmentAdd as AddTaskIcon } from "react-icons/md";
import ErrorBoundary from './ErrorBoundary';
import styles from './TodoList.module.css'

type AvailableDialogs = ModalData.AvailableDialogs;

function TodoList() {
    const [activeDialog, setActiveDialog] = useState<AvailableDialogs>(null);

    return (
        <main>
            <TodoProvider>
                <ErrorBoundary fallback={<p>Error Occurred at error boundary of todoList</p>}>
                    <div className={styles['add-task-container']} >
                        <button className={styles['add-task-button']} onClick={(e) => {e.preventDefault();setActiveDialog('task-editor')}}>
                            <span className={styles['add-task-icon']}>
                                <AddTaskIcon />
                            </span>
                            <span className={styles['add-task-label']}>
                                Add Task
                            </span>
                        </button>
                    </div>
                    <TaskList activeDialog={activeDialog} setActiveDialog={setActiveDialog}/>
                </ErrorBoundary>
            </TodoProvider>
        </main>
    )
}

export default TodoList;