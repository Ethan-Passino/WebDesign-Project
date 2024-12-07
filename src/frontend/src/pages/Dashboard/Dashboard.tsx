import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Subtask {
    title: string;
    completed: boolean;
}

interface Task {
    _id: string;
    name: string;
    description?: string;
    completed?: boolean;
    dueBy?: Date; // Optional due date
    parentPanel?: string; // Reference to the parent panel ID
    subtasks?: Subtask[]; // Array of subtasks
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

    const [showSubtaskPopup, setShowSubtaskPopup] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    const [showDeleteTaskPopup, setShowDeleteTaskPopup] = useState(false);
    const [targetSubtaskIndex, setTargetSubtaskIndex] = useState<number | null>(null);

    const [showDeletePanelPopup, setShowDeletePanelPopup] = useState(false);
    const [targetPanelId, setTargetPanelId] = useState<string | null>(null);



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

        fetchPanels();
    }, [dashboardId, navigate]);

    

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

    // Toggle subtask completion
    const toggleSubtaskCompletion = (index: number) => {
        setSelectedTask((prev) =>
            prev
                ? {
                    ...prev,
                    subtasks: prev.subtasks?.map((subtask, i) =>
                        i === index ? { ...subtask, completed: !subtask.completed } : subtask
                    ),
                }
                : null
        );
    };

    // Calculate completed subtasks
    const completedSubtasksCount = selectedTask?.subtasks?.filter((sub) => sub.completed).length || 0;

    // Calculate completion percentage
    const completionPercentage =
    selectedTask?.subtasks && selectedTask.subtasks.length > 0
        ? Math.round((completedSubtasksCount / selectedTask.subtasks.length) * 100)
        : 0;




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
                    completed: selectedTask?.completed,
                    dueBy: selectedTask?.dueBy,
                    parentPanel: selectedTask?.parentPanel,
                    subtasks: selectedTask?.subtasks || [],
                }),
            });
    
            if (response.ok) {
                // Refetch panels and tasks to reflect changes
                const token = localStorage.getItem('authToken');
                const userId = localStorage.getItem('userId');
    
                if (!token || !userId) {
                    navigate('/login');
                    return;
                }
    
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
                }
            } else {
                console.error("Failed to save task");
            }
        } catch (error) {
            console.error("Error saving task:", error);
        } finally {
            setShowTaskPopup(false); // Close the popup after saving
        }
    };
    
    const addSubtask = () => {
        setShowSubtaskPopup(true);
        setNewSubtaskTitle('');
    };

    const handleAddSubtask = () => {
        if (!newSubtaskTitle.trim()) {
            alert('Subtask title is required.');
            return;
        }
    
        setSelectedTask((prev) =>
            prev
                ? {
                    ...prev,
                    subtasks: [
                        ...(prev.subtasks || []),
                        { title: newSubtaskTitle.trim(), completed: false },
                    ],
                }
                : null
        );
        setShowSubtaskPopup(false);
    };
    
    const handleDeleteTask = async () => {
        if (targetSubtaskIndex !== null && selectedTask) {
            // Handle subtask deletion
            setSelectedTask((prev) =>
                prev
                    ? {
                          ...prev,
                          subtasks: prev.subtasks?.filter((_, i) => i !== targetSubtaskIndex),
                      }
                    : null
            );
            setTargetSubtaskIndex(null); // Reset target index
        } else if (selectedTask) {
            // Handle regular task deletion
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;
    
                const response = await fetch(`/tasks/${selectedTask._id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.ok) {
                    setPanels((prevPanels) =>
                        prevPanels.map((panel) =>
                            panel._id === selectedTask.parentPanel
                                ? {
                                      ...panel,
                                      childTasks: panel.childTasks.filter((task) => task._id !== selectedTask._id),
                                  }
                                : panel
                        )
                    );
                    setSelectedTask(null);
                } else {
                    console.error('Failed to delete task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    
        setShowDeleteTaskPopup(false); // Close the popup
    };
    

    const handleDeleteSubtask = (index: number) => {
        // Store the index of the subtask to be deleted and show the delete confirmation popup
        setTargetSubtaskIndex(index);
        setShowDeleteTaskPopup(true);
    };

    const handleDeletePanel = async () => {
        if (!targetPanelId) return;
    
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
    
            const response = await fetch(`/panels/${targetPanelId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                setPanels((prevPanels) =>
                    prevPanels.filter((panel) => panel._id !== targetPanelId)
                );
            } else {
                console.error('Failed to delete panel');
            }
        } catch (error) {
            console.error('Error deleting panel:', error);
        } finally {
            setShowDeletePanelPopup(false);
            setTargetPanelId(null);
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <h2 className="panelHeader">{panel.name}</h2>
                        <button
                            className="delete-panel-button"
                            onClick={() => {
                                setTargetPanelId(panel._id);
                                setShowDeletePanelPopup(true);
                            }}
                        >
                            &times;
                        </button>
                    </div>
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
    <div
        className="task-popup-overlay"
        onClick={(e) => {
            // Close the popup if the click is outside the content area
            if (e.target === e.currentTarget) handleSaveTask();
        }}
    >
        <div className="task-popup-content">
            {/* Close Button */}
            <button
                className="close-popup-button"
                onClick={handleSaveTask}
            >
                X
            </button>

            {/* Task Name */}
            <input
                type="text"
                value={selectedTaskName}
                onChange={(e) => setSelectedTaskName(e.target.value)}
                placeholder="Task Name"
                style={{
                    backgroundColor: '#f9f9f9',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.5em',
                    padding: '10px',
                    textAlign: 'center',
                }}
            />

            {/* Task Description */}
            <textarea
                value={selectedTaskDescription}
                onChange={(e) => setSelectedTaskDescription(e.target.value)}
                placeholder="Task Description"
                style={{
                    height: '150px',
                    padding: '10px',
                }}
            ></textarea>

            {/* Due Date */}
            <label style={{ display: 'block', marginBottom: '8px' }}>Due Date:</label>
            <input
                type="date"
                value={selectedTask?.dueBy ? new Date(selectedTask.dueBy).toISOString().substring(0, 10) : ''}
                onChange={(e) =>
                    setSelectedTask((prev) =>
                        prev ? { ...prev, dueBy: new Date(e.target.value) } : null
                    )
                }
                style={{
                    padding: '10px',
                    borderRadius: '4px',
                    width: '100%',
                }}
            />

            {/* Parent Panel */}
            <label style={{ display: 'block', marginBottom: '8px' }}>Parent Panel:</label>
            <select
                value={selectedTask?.parentPanel}
                onChange={(e) =>
                    setSelectedTask((prev) =>
                        prev ? { ...prev, parentPanel: e.target.value } : null
                    )
                }
                style={{
                    padding: '10px',
                    borderRadius: '4px',
                    width: '100%',
                }}
            >
                {panels.map((panel) => (
                    <option key={panel._id} value={panel._id}>
                        {panel.name}
                    </option>
                ))}
            </select>

            {/* Subtasks Section */}
            <div className="subtasks-section">
                <h3>Subtasks</h3>
                <div className="subtasks-progress">
                    {completedSubtasksCount}/{selectedTask.subtasks?.length || 0} subtasks completed (
                    {completionPercentage}% complete)
                </div>
                <div className="subtasks-list">
                    {selectedTask.subtasks?.map((subtask, index) => (
                        <div
                            key={index}
                            className={`subtask-item ${subtask.completed ? 'completed' : ''}`}
                            onClick={() => toggleSubtaskCompletion(index)}
                        >
                            <span>{subtask.title}</span>
                            <button
                                className="delete-subtask-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent parent onClick from triggering
                                    handleDeleteSubtask(index)
                                }}
                                style={{ backgroundColor: '#dc3545', color: '#fff' }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={addSubtask} className="add-subtask-button">
                    Add Subtask
                </button>
            </div>

            {/* Completed Status */}
            <button
                className={`status-button ${
                    selectedTask.completed ? 'completed' : 'not-completed'
                }`}
                onClick={async () => {
                    try {
                        const token = localStorage.getItem('authToken');
                        if (!token) {
                            navigate('/login');
                            return;
                        }

                        const response = await fetch(`/tasks/${selectedTask._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                completed: !selectedTask.completed,
                            }),
                        });

                        if (response.ok) {
                            const updatedTask = await response.json();
                            setSelectedTask(updatedTask);

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
                        }
                    } catch (error) {
                        console.error('Error toggling task status:', error);
                    }
                }}
            >
                {selectedTask.completed ? 'Completed' : 'Not Completed'}
            </button>
            <button
                className="delete-task-button"
                onClick={() => setShowDeleteTaskPopup(true)}
                style={{ marginTop: '10px', backgroundColor: '#dc3545', color: '#fff' }}
            >
                Delete Task
            </button>

        </div>
    </div>
)}

            {showSubtaskPopup && (
                <div
                    className="subtask-popup-overlay"
                    onClick={(e) => {
                        // Close the popup if the click is outside the content area
                        if (e.target === e.currentTarget) setShowSubtaskPopup(false);
                    }}
                >
                    <div className="subtask-popup-content">
                        <h2>Add Subtask</h2>
                        <input
                            type="text"
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            placeholder="Subtask Title"
                        />
                        <div className="subtask-popup-buttons">
                            <button className="subtask-popup-button confirm" onClick={handleAddSubtask}>
                                Add
                            </button>
                            <button
                                className="subtask-popup-button cancel"
                                onClick={() => setShowSubtaskPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
 {showDeleteTaskPopup && (
    <div
        className="task-popup-overlay"
        onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteTaskPopup(false);
        }}
    >
        <div className="subtask-popup-content">
            <h2>
                {targetSubtaskIndex !== null ? 'Delete Subtask' : 'Delete Task'}
            </h2>
            <p>
                Are you sure you want to delete this{' '}
                {targetSubtaskIndex !== null ? 'subtask' : 'task'}? This action cannot be undone.
            </p>
            <div className="subtask-popup-buttons">
                <button className="subtask-popup-button confirm" onClick={handleDeleteTask}>
                    Yes, Delete
                </button>
                <button
                    className="subtask-popup-button cancel"
                    onClick={() => {
                        setShowDeleteTaskPopup(false);
                        setTargetSubtaskIndex(null); // Reset target index in case of cancel
                    }}
                >
                    Cancel
                </button>
            </div>
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

{showDeletePanelPopup && (
    <div
        className="task-popup-overlay"
        onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeletePanelPopup(false);
        }}
    >
        <div className="subtask-popup-content">
            <h2>Delete Panel</h2>
            <label>Are you sure you want to delete this panel? This action cannot be undone.</label>
            <div className="subtask-popup-buttons">
                <button className="subtask-popup-button confirm" onClick={handleDeletePanel}>
                    Yes, Delete
                </button>
                <button
                    className="subtask-popup-button cancel"
                    onClick={() => setShowDeletePanelPopup(false)}
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
