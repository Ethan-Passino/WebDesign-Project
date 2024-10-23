import "./Dashboard.css";
import {TaskList} from './Dashboard Components/TaskList'

/*
interface taskItem{
    id: number;
    text: string;
}
    */

export function Dashboard() {
    /*
    const [tasks, setTasks]  = useState<taskItem[]>([]);
    const [newTaskText, setNewTaskText] = useState<string>('');

    const addTask = () => {
        if(newTaskText.trim() !== ''){
            const newTask: taskItem = {id: Date.now(), text: newTaskText};
            setTasks([...tasks, newTask]);
            setNewTaskText('');

        }
    }


    const updateTask = (id: number, newText: string)=> {
        const updatedTask = tasks.map(task =>
            task.id === id ? {...task, text: newText} : task);
        setTasks(updatedTask);

    };
*/
    return (
        <div className="Dashboard-root">
            <h1 className={"Root-header"}>This is an attempt at at a dashboard</h1>
            <div className={"Layout-grid"}>
                <div className={"Task-root task1"}>
                    <h1 className={"Board-header"}>Backlog</h1>
                    <div className={"Task-list-root"}>
                        <TaskList></TaskList>
                    </div>
                    <textarea className={"Task-text"}>
                        This is a paragraph
                    </textarea>
                    <div className={"Game-root"}>
                        <h1 className={"Game-header"}>Gameification area</h1>
                    </div>
                </div>
                <div className={"Task-root task2"}>
                    <h1 className={"Board-header"}>To-do</h1>
                    <div className={"Task-list-root"}>
                        <TaskList></TaskList>
                    </div>
                    <textarea className={"Task-text"} rows={3} cols={10}>
                        This is a paragraph
                    </textarea>
                    <div className={"Game-root"}>
                        <h1 className={"Game-header"}>Gameification area</h1>
                    </div>
                </div>
                <div className={"Task-root task3"}>
                    <h1 className={"Board-header"}>In Progress</h1>
                    <div className={"Task-list-root"}>
                        <TaskList></TaskList>
                    </div>
                    <textarea className={"Task-text"}>
                        This is a paragraph
                    </textarea>
                    <div className={"Game-root"}>
                        <h1 className={"Game-header"}>Gameification area</h1>
                    </div>
                </div>
                <div className={"Task-root 4"}>
                    <h1 className={"Board-header"}>Backlog</h1>
                    <div className={"Task-list-root"}>
                        <TaskList></TaskList>
                    </div>
                    <textarea className={"Task-text"}>
                            This is a paragraph
                        </textarea>
                    <div className={"Game-root"}>
                        <h1 className={"Game-header"}>Gameification area</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;