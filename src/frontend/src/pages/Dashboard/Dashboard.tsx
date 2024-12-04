import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Task {
    _id: string;
    name: string;
    description?: string;
    completed?: boolean;
}

interface Panel {
    _id: string;
    name: string;
    childTasks: Task[];
}

const Dashboard: React.FC = () => {
    const { dashboardId } = useParams();
    const navigate = useNavigate();
    const [panels, setPanels] = useState<Panel[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    
    const [selectedTaskName, setSelectedTaskName] = useState("");
    const [selectedTaskDescription, setSelectedTaskDescription] = useState("");
    const [showTaskPopup, setShowTaskPopup] = useState(false);
    
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [currentPanelId, setCurrentPanelId] = useState<string | null>(null);

    const [showAddPanelPopup, setShowAddPanelPopup] = useState(false);
    const [newPanelName, setNewPanelName] = useState('');

    useEffect(() => {
        const fetchPanels = async () => {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`/panels?dashboardId=${dashboardId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && Array.isArray(data.data)) {
                        const fetchedPanels: Panel[] = await Promise.all(
                            data.data.map(async (panel: Panel) => {
                                const tasks = await fetchTasks(panel._id, token);
                                return {
                                    ...panel,
                                    childTasks: tasks || [],
                                };
                            })
                        );
                        setPanels(fetchedPanels);
                    } else {
                        console.error('Unexpected panel response format:', data);
                        setErrorMessage('Unexpected response from the server.');
                    }
                } else {
                    console.error('Failed to fetch panels:', response.status);
                    setErrorMessage('Failed to load panels. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching panels:', error);
                setErrorMessage('An error occurred while fetching panels.');
            } finally {
                setLoading(false);
            }
        };

        const fetchTasks = async (panelId: string, token: string): Promise<Task[] | null> => {
            try {
                const response = await fetch(`/tasks/panel/${panelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.success && Array.isArray(data.data)) {
                        return data.data;
                    } else {
                        console.error('Unexpected task response format:', data);
                        return null;
                    }
                } else {
                    console.error('Failed to fetch tasks for panel:', panelId, 'Status:', response.status);
                    return null;
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                return null;
            }
        };

        fetchPanels();
    }, [dashboardId, navigate]);

    const handleAddPanel = async () => {
        if (!newPanelName) return;

        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) {
                navigate('/login');
                return;
            }

            const response = await fetch(`/panels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    newName: newPanelName,
                    dashId: dashboardId,
                    creatorId: userId,
                }),
            });

            if (response.ok) {
                const newPanel = await response.json();
                setPanels([...panels, { ...newPanel, childTasks: [] }]);
                setShowAddPanelPopup(false);
                setNewPanelName('');
            } else {
                console.error('Failed to add panel');
            }
        } catch (error) {
            console.error('Error adding panel:', error);
        }
    };

    const handleAddTaskClick = (panelId: string) => {
        setCurrentPanelId(panelId);
        setShowAddTaskPopup(true);
    };

    const handleAddTask = async () => {
        if (!newTaskName || !currentPanelId) {
            alert('Task name is required.');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) {
                navigate('/login');
                return;
            }

            const response = await fetch(`/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    panelId: currentPanelId,
                    newName: newTaskName,
                    description: newTaskDescription,
                    creatorId: userId,
                }),
            });

            if (response.ok) {
                const newTask = await response.json();
                setPanels(
                    panels.map((panel) =>
                        panel._id === currentPanelId
                            ? {
                                ...panel,
                                childTasks: panel.childTasks ? [...panel.childTasks, newTask] : [newTask],
                            }
                            : panel
                    )
                );
                setShowAddTaskPopup(false);
                setNewTaskName('');
                setNewTaskDescription('');
            } else {
                console.error('Failed to add task:', response.status);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
    };

    const handleClosePopup = () => {
        setSelectedTask(null);
    };

    const handleSaveTask = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                navigate("/login");
                return;
            }
    
            const response = await fetch(`/tasks/${selectedTask?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: selectedTaskName,
                    description: selectedTaskDescription,
                }),
            });
    
            if (response.ok) {
                const updatedTask = await response.json();
                setPanels((prevPanels) =>
                    prevPanels.map((panel) =>
                        panel._id === updatedTask.parentPanel
                            ? {
                                  ...panel,
                                  childTasks: panel.childTasks.map((task) =>
                                      task._id === updatedTask._id ? updatedTask : task
                                  ),
                              }
                            : panel
                    )
                );
                setShowTaskPopup(false);
            } else {
                console.error("Failed to save task");
            }
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error-message">{errorMessage}</div>;
    }

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <button className="add-panel-button" onClick={() => setShowAddPanelPopup(true)}>
                Add Panel
            </button>
            <div className="panels">
                {panels.map((panel) => (
                    <div key={panel._id} className="panel">
                        <h2>{panel.name}</h2>
                        <ul>
                            {panel.childTasks.map((task) => (
                                <li
                                key={task._id}
                                onClick={() => {
                                    setSelectedTask(task);
                                    setSelectedTaskName(task.name);
                                    setSelectedTaskDescription(task.description || "");
                                    setShowTaskPopup(true);
                                }}
                            >
                                {task.name}
                            </li>
                            ))}
                        </ul>
                        <button
                            className="add-task-button"
                            onClick={() => handleAddTaskClick(panel._id)}
                        >
                            Add Task
                        </button>
                    </div>
                ))}
            </div>
            {selectedTask && showTaskPopup && (
    <div className="task-popup">
        <div className="task-popup-content">
            <h2>Edit Task</h2>
            <input
                type="text"
                value={selectedTaskName}
                onChange={(e) => setSelectedTaskName(e.target.value)}
                placeholder="Task Name"
            />
            <textarea
                value={selectedTaskDescription}
                onChange={(e) => setSelectedTaskDescription(e.target.value)}
                placeholder="Task Description"
            ></textarea>
            <div className="task-status">
                {selectedTask.completed ? "Completed" : "Not Completed"}
            </div>
            <button onClick={handleSaveTask}>Save</button>
            <button onClick={() => setShowTaskPopup(false)}>Cancel</button>
        </div>
    </div>
)}


            {showAddTaskPopup && (
               <div className="add-task-popup">
               <div className="add-task-popup-content">
                   <h2>Add Task</h2>
                   <input
                       type="text"
                       placeholder="Task Name"
                       value={newTaskName}
                       onChange={(e) => setNewTaskName(e.target.value)}
                   />
                   <textarea
                       placeholder="Task Description"
                       value={newTaskDescription}
                       onChange={(e) => setNewTaskDescription(e.target.value)}
                   />
                   <button onClick={handleAddTask}>Add Task</button>
                   <button onClick={() => setShowAddTaskPopup(false)}>Cancel</button>
               </div>
           </div>
           
            )}

{showAddPanelPopup && (
                <div className="panel-popup">
                    <div className="panel-popup-content">
                        <h2>Add Panel</h2>
                        <input
                            type="text"
                            value={newPanelName}
                            onChange={(e) => setNewPanelName(e.target.value)}
                            placeholder="Panel Name"
                        />
                        <div className="panel-popup-buttons">
                            <button className="add-panel-popup-button" onClick={handleAddPanel}>
                                Add Panel
                            </button>
                            <button
                                className="cancel-panel-popup-button"
                                onClick={() => setShowAddPanelPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
