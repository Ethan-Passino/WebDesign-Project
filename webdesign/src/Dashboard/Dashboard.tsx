import "./Dashboard.css";

import {TaskList} from './Dashboard Components/TaskList'

//TODO: Gamification bar

export function Dashboard() {
    return (
        <div className="Dashboard-root">
            <h1 className={"Root-header"}>This is an attempt at at a dashboard</h1>
            <div className={"Layout-grid"}>
                <div className={"Task-root task1"}>
                    <h3 className={"Board-header"}>Backlog</h3>
                    <div className={"Task-list-root"}>
                        <TaskList></TaskList>
                    </div>

                    <div className={"Game-root"}>
                        <h4 className={"Game-header"}>Gamification area</h4>
                    </div>
                </div>
                <div className={"Task-root task2"}>
                    <h3 className={"Board-header"}>To-do</h3>
                    <div className={"Task-list-root"}>
                        <TaskList></TaskList>
                    </div>
                    <div className={"Game-root"}>
                        <h4 className={"Game-header"}>Gamification area</h4>
                    </div>
                </div>
                <div className={"Task-root task3"}>
                    <h3 className={"Board-header"}>In Progress</h3>
                    <div className={"Task-list-root"}>
                        <TaskList></TaskList>
                    </div>

                    <div className={"Game-root"}>
                        <h4 className={"Game-header"}>Gamification area</h4>
                    </div>
                </div>
                <div className={"Task-root 4"}>
                    <h3 className={"Board-header"}>Backlog</h3>
                    <div className={"Task-list-root"}>
                        <TaskList></TaskList>
                    </div>

                    <div className={"Game-root"}>
                        <h4 className={"Game-header"}>Gamification area</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;