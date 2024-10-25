import "./TaskList.css";
import {useState} from "react";


interface TaskItem{
    id: number;
    text: string; //TODO: add due dates
    completed: boolean;
    subtasks?: TaskItem[];
}



export function TaskList() {
    const [tasks, setTasks]  = useState<TaskItem[]>([]);
    const [newTaskText, setNewTaskText] = useState<string>('');

    const addTask = (parentId?: number) => {
        if (newTaskText.trim() !== '') {
            const newTask: TaskItem = {id: Date.now(), text: newTaskText, completed: false, subtasks: []};
            setTasks([...tasks, newTask]);
            setNewTaskText('');

            if (parentId) {
                setTasks(
                    tasks.map(task =>
                        task.id === parentId ? {
                                ...task, subtasks: [...task.subtasks || [], newTask]
                            }
                            : task)
                )
            } else {
                setTasks([...tasks, newTask]);
            }
        setNewTaskText("");
        }
    };


    const updateTask = (id: number, newText: string, taskList: TaskItem[] = tasks ): TaskItem[]=> {
        const updatedTasks = taskList.map(task =>
            task.id === id
                ?  {...task, text: newText}
                : task.subtasks
                ? {...task, subtasks: updateTask(id, newText, task.subtasks)}
                : task
        );

        if(taskList === tasks){
            setTasks(updatedTasks);
        }
        return updatedTasks;
    };

    const toggleTaskCompleted = (id: number, taskList: TaskItem[] = tasks): TaskItem[] =>{
        const updatedTasks = taskList.map(task =>
            task.id === id
                ?  {...task, completed: !task.completed}
                : task.subtasks
                    ? {...task, subtasks: toggleTaskCompleted(task.id, taskList)}
                    : task
        );

        if(taskList === tasks){
            setTasks(updatedTasks);
        }
        return updatedTasks;
    }

    const renderTasks = (taskList: TaskItem[]) =>{
        return(
            <ul className="Task-list">
                {taskList.map(task => (
                    <div className={"Task-List-item"}>
                        <li key={task.id} className={task.completed ? "completed" : ''}>
                            <input type={"checkbox"} checked={task.completed}
                                   onChange={() => toggleTaskCompleted(task.id)}
                                   className={"Add-Task-Checkbox"}/>
                            <input type={"text"} value={task.text}
                                   onChange={(e) => updateTask(task.id, e.target.value)}
                                   className={"Add-Task-Text"}/>
                            <button onClick={() => addTask(task.id)} className={"Add-Subtask-Button"}>+</button>
                            {task.subtasks && task.subtasks.length > 0 && renderTasks(task.subtasks)}
                        </li>
                    </div>
                ))}
            </ul>
        );
    };



    return (
        <div className="TaskList">
            <input type={"text"}
                   value={newTaskText}
                   onChange={(e)=> setNewTaskText(e.target.value)}
                   placeholder={"add new task"}
                    className={"Add-Task-Text"}/>
            <button onClick={() => addTask()} className={"Add-Task-Button"}>+</button>
            {renderTasks(tasks)}
        </div>
    );
}