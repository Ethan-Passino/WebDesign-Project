import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Task {
    _id: string;
    name: string;
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
        const panelName = prompt('Enter panel name:');
        if (!panelName) return;

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
                    newName: panelName,
                    dashId: dashboardId,
                    creatorId: userId,
                }),
            });

            if (response.ok) {
                const newPanel = await response.json();
                setPanels([...panels, { ...newPanel, childTasks: [] }]);
            } else {
                console.error('Failed to add panel');
            }
        } catch (error) {
            console.error('Error adding panel:', error);
        }
    };

    const handleAddTask = async (panelId: string) => {
        const taskName = prompt('Enter task name:');
        if (!taskName) return;

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
                    panelId,
                    newName: taskName,
                    creatorId: userId,
                }),
            });

            if (response.ok) {
                const newTask = await response.json();
                setPanels(
                    panels.map((panel) =>
                        panel._id === panelId
                            ? {
                                ...panel,
                                childTasks: panel.childTasks ? [...panel.childTasks, newTask] : [newTask],
                            }
                            : panel
                    )
                );
            } else {
                console.error('Failed to add task:', response.status);
            }
        } catch (error) {
            console.error('Error adding task:', error);
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
            <button className="add-panel-button" onClick={handleAddPanel}>
                Add Panel
            </button>
            <div className="panels">
                {panels.map((panel) => (
                    <div key={panel._id} className="panel">
                        <h2>{panel.name}</h2>
                        <ul>
                            {panel.childTasks.map((task) => (
                                <li key={task._id}>{task.name}</li>
                            ))}
                        </ul>
                        <button
                            className="add-task-button"
                            onClick={() => handleAddTask(panel._id)}
                        >
                            Add Task
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
