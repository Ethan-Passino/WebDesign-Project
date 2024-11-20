import'./TaskList.css';
import React, {useEffect, useState} from 'react';


//TODO:
// -add stuff to backend and convert this to use it
// -fix subtasks
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
/**
 * @type TaskProps
 * @param {string} taskName
 * @param {string} [text]
 * @param {string} id
 * @param {string} parentPanel
 * @param {boolean} completed - only marked so to allow default value
 * @param {string} [dueBy]
 * @param {TaskProps[]} [subtasks]
 *
 */
export type TaskProps = {
    id: number;
    taskName: string;
    text?: string;
    parentPanel: string;
    completed?: boolean;
    dueBy?: number;
    subtasks?: TaskProps[];
}


/**
* */
function Task({ id, taskName, text = '', parentPanel = '' ,completed = false,dueBy = Date.now(), subtasks = [] }: TaskProps){
    const [taskState, setTaskState] = useState({
        id,
        taskName,
        text,
        parentPanel,
        completed,
        dueBy,
        subtasks,
    })

    useEffect(() => {
    })


    const updateTask = async (updates: Partial<TaskProps>) => {
        try{
            
        }catch{

        }
    }

    const taskNetworkHandler = (id: string) =>{

    }


    return (
        <></>
    );
};;

export default Task;