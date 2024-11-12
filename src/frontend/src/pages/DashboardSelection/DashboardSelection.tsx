import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardSelection.css';

interface Dashboard {
    _id: string;
    name: string;
    description?: string;
    creatorId: string;
    invitedUsers?: string[];
}

const DashboardSelector: React.FC = () => {
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [newDashboardName, setNewDashboardName] = useState('');
    const [newDashboardDescription, setNewDashboardDescription] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        } else {
            fetchDashboards(token);
        }
    }, [navigate]);

    const fetchDashboards = async (token: string) => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        if (!userId) {
            console.error('No userId found in localStorage.');
            return; // Exit if userId is undefined
        }
        
        try {
            const response = await fetch(`/dashboards?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setDashboards(data);
            } else {
                console.error('Failed to fetch dashboards:', response.status);
            }
        } catch (error) {
            console.error('Error fetching dashboards:', error);
        }
    };
    
    

    const handleDashboardSelect = () => {
        // Temporarily redirect to a generic dashboard page
        navigate('/dashboard');
        
        // Commented out code to navigate to specific dashboard by ID
        // const handleDashboardSelect = (dashboardId: string) => {
        //     navigate(`/dashboard/${dashboardId}`);
        // };
    };

    const handleCreateDashboard = async () => {
        setFeedbackMessage(null);
    
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId'); // Retrieve the actual user ID
    
        if (!userId || !token) { // Check if both token and userId are available
            console.error('User not authenticated: missing token or userId.');
            setFeedbackMessage('Failed to create dashboard: user not authenticated.');
            return;
        }
    
        const newDashboard = {
            name: newDashboardName,
            description: newDashboardDescription,
            creatorId: userId // Use the actual user ID here
        };
    
        try {
            const response = await fetch('/dashboards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newDashboard),
            });
    
            if (response.ok) {
                await fetchDashboards(token); // Refresh the list of dashboards after creating one
                setNewDashboardName('');
                setNewDashboardDescription('');
                setFeedbackMessage('Dashboard created successfully!');
                setShowCreateForm(false);
            } else {
                const errorData = await response.json();
                setFeedbackMessage(errorData.error || 'Failed to create dashboard. Please try again.');
            }
        } catch (error) {
            setFeedbackMessage('An error occurred. Please try again.');
            console.error('Error creating dashboard:', error);
        }
    };
    
    

    return (
        <div className="dashboard-selector">
            <h1>Select or Create a Dashboard</h1>

            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

            <div className="dashboard-list">
                <h2>Your Dashboards</h2>
                <div className="dashboard-cards">
                    {dashboards.length > 0 ? (
                        dashboards.map((dashboard) => (
                            <div key={dashboard._id} className="dashboard-card" onClick={handleDashboardSelect}>
                                <h3>{dashboard.name}</h3>
                                <p>{dashboard.description}</p>
                            </div>
                        ))
                    ) : (
                        <div className="no-dashboards-message">No dashboards available. Create a new one to get started!</div>
                    )}
                </div>
            </div>

            {!showCreateForm ? (
                <button className="show-create-button" onClick={() => setShowCreateForm(true)}>
                    Create New Dashboard
                </button>
            ) : (
                <div className="create-dashboard">
                    <h2>Create a New Dashboard</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateDashboard(); }}>
                        <input
                            type="text"
                            placeholder="Dashboard Title"
                            value={newDashboardName}
                            onChange={(e) => setNewDashboardName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={newDashboardDescription}
                            onChange={(e) => setNewDashboardDescription(e.target.value)}
                            maxLength={100}
                        />
                        <button type="submit">Create Dashboard</button>
                    </form>
                    <button className="cancel-button" onClick={() => setShowCreateForm(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default DashboardSelector;
