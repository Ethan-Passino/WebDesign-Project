import React, {useState} from "react";

interface TaskItem{
    id: number;
    text: string; //TODO: add parent/child tasks, due dates, subtask functionality
}



export function TaskList() {
    const [tasks, setTasks]  = useState<TaskItem[]>([]);
    const [newTaskText, setNewTaskText] = useState<string>('');

    const addTask = () => {
        if(newTaskText.trim() !== ''){
            const newTask: TaskItem = {id: Date.now(), text: newTaskText};
            setTasks([...tasks, newTask]);
            setNewTaskText('');

        }
    };


    const updateTask = (id: number, newText: string)=> {
        const updatedTask = tasks.map(task =>
            task.id === id ? {...task, text: newText} : task);
        setTasks(updatedTask);

    };
    return (
        <div className="TaskList">
            {[
                <input type={'text'} value={newTaskText}
                       onChange={e => setNewTaskText(e.target.value)}
                />,
                <button onClick={addTask}>Add Task</button>,
                <ul className={"Task-ul1 Task-list"}>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <input type={"text"} value={task.text}
                            onChange={(e) => updateTask(task.id, e.target.value)}
                            />
                        </li>
                    ))}
                </ul>

            ]}
        </div>
    );
}