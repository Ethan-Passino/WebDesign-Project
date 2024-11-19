import'./TaskList.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';


//TODO:
// -add stuff to backend and convert this to use it
// -fix subtasks

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
    id: string;
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
        axios.get(``);
    })


    const updateTask = async (updates: Partial<TaskProps>) => {
        try{
            const response =
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