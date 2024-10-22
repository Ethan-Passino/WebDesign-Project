import "./Dashboard.css";
import {useState} from "react";


interface taskItem{
    id: string;
    text: string;
}

export function Dashboard() {
    const [items, setItems]  = useState<string[]>([]);
    const [newItem, setNewItem] = useState<string>("");
    const addItem = () => {
        if(newItem.trim() !== ''){
            setItems([...items, newItem]);
            setNewItem("");
        }
    }


    const updateItem = (id: string, newText: string)=> {
        const updatedItem = items.map(item =>
            item.id === id ? {...item, text: newText} : item); {/verify if this is a TS error or not/}
        setItems(updatedItem);

    }
    return (
        <div className="Dashboard-root">
            <h1 className={"Root-header"}>This is an attempt at at a dashboard</h1>
            <div className={"Layout-grid"}>
                <div className={"Task-root task1"}>
                    <h1 className={"Board-header"}>Backlog</h1>
                    <div className={"Task-list-root"}>
                        <ul className={"Task-ul1 Task-list"}>
                            <input type={"text"} value={newItem}
                                   onChange={(e) => updateItem(e.target.id, e.target.value)}
                                   placeholder={"add a new item"}/> {/TODO: verify this is working as intended with multiple cases/}
                            <button onClick={addItem}>Add Item</button> {/TODO: Update CSS to make this look better/}
                            {items.map((item) => (
                                <div>
                                    <li key={item.id}>
                                        <input type={"text"} value={item.text} onChange={(e) => setNewItem(e.target.value)}/>
                                    </li>
                                </div>
                            ))}

                            {/*<li><input className={"Task-list-item"}/></li>*/}
                            {/*<li><input className={"Task-list-item"}/></li>*/}
                            {/*<li><input className={"Task-list-item"}/></li>*/}
                        </ul>
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
                        <ul className={"Task-ul1 Task-list"}>
                            <li><input className={"Task-list-item"}/></li>
                            <li><input className={"Task-list-item"}/></li>
                            <li><input className={"Task-list-item"}/></li>
                        </ul>
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
                        <ul className={"Task-ul1 Task-list"}>
                            <li><input className={"Task-list-item"}/></li>
                            <li><input className={"Task-list-item"}/></li>
                            <li><input className={"Task-list-item"}/></li>
                        </ul>
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
                        <ul className={"Task-ul1 Task-list"}>
                            <li><input className={"Task-list-item"}/></li>
                            <li><input className={"Task-list-item"}/></li>
                            <li><input className={"Task-list-item"}/></li>

                        </ul>
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