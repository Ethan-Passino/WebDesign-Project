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
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [popupType, setPopupType] = useState<'invite' | 'modify' | 'create' | null>(null);
    const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
    const [inviteName, setInviteName] = useState('');
    const [modifyName, setModifyName] = useState('');
    const [modifyDescription, setModifyDescription] = useState('');
    const [newDashboardName, setNewDashboardName] = useState('');
    const [newDashboardDescription, setNewDashboardDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Current logged-in user ID
    const [invitedUsernames, setInvitedUsernames] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const currentUserId = localStorage.getItem('userId');
        setUserId(currentUserId);

        if (!token) {
            navigate('/login');
        } else {
            fetchDashboards(token);
        }
    }, [navigate]);

    const fetchDashboards = async (token: string) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No userId found in localStorage.');
            return;
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

    const handleDashboardSelect = (dashboardId: string) => {
        navigate(`/dashboard/${dashboardId}`);
    };

    const handleInviteUsers = async (dashboard: Dashboard) => {
        setPopupType('invite');
        setCurrentDashboard(dashboard);

        // Fetch usernames for invited users
        if (dashboard.invitedUsers && dashboard.invitedUsers.length > 0) {
            try {
                const responses = await Promise.all(
                    dashboard.invitedUsers.map((userId) =>
                        fetch(`/auth/profile/${userId}`, { method: 'GET' })
                    )
                );
                const fetchedUsernames: Record<string, string> = {};
                for (let index = 0; index < responses.length; index++) {
                    const response = responses[index];
                    if (response.ok) {
                        const { username } = await response.json();
                        fetchedUsernames[dashboard.invitedUsers[index]] = username;
                    } else {
                        console.error(`Failed to fetch username for userId: ${dashboard.invitedUsers[index]}`);
                    }
                }
                setInvitedUsernames(fetchedUsernames);
            } catch (error) {
                console.error('Error fetching usernames for invited users:', error);
            }
        }
    };

    const handleModifyDashboard = (dashboard: Dashboard) => {
        setPopupType('modify');
        setCurrentDashboard(dashboard);
        setModifyName(dashboard.name);
        setModifyDescription(dashboard.description || '');
    };

    const handleCreateDashboard = async () => {
        setFeedbackMessage(null);

        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId'); // Retrieve the actual user ID

        if (!userId || !token) {
            console.error('User not authenticated: missing token or userId.');
            setFeedbackMessage('Failed to create dashboard: user not authenticated.');
            return;
        }

        const newDashboard = {
            name: newDashboardName,
            description: newDashboardDescription,
            creatorId: userId,
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
                setPopupType(null); // Close the popup
            } else {
                const errorData = await response.json();
                setFeedbackMessage(errorData.error || 'Failed to create dashboard. Please try again.');
            }
        } catch (error) {
            setFeedbackMessage('An error occurred. Please try again.');
            console.error('Error creating dashboard:', error);
        }
    };

    const handleInviteSubmit = async () => {
        if (!inviteName) {
            setErrorMessage('Please enter a valid name.');
            return;
        }

        if (inviteName === userId) {
            setErrorMessage("You can't invite yourself to your own dashboard.");
            return;
        }

        if (currentDashboard?.invitedUsers?.includes(inviteName)) {
            setErrorMessage(`${inviteName} is already invited.`);
            return;
        }

        if (inviteName === currentDashboard?.creatorId) {
            setErrorMessage("You can't invite the dashboard owner.");
            return;
        }

        try {
            const response = await fetch(`/auth/userbyName/${inviteName}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const inviteResponse = await fetch(`/dashboards/${currentDashboard?._id}/invite`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: inviteName }),
                });

                if (inviteResponse.ok) {
                    setFeedbackMessage(`Successfully invited ${inviteName} to the dashboard.`);
                    setPopupType(null);
                    setInviteName('');
                } else {
                    setErrorMessage('Failed to invite user. Please try again.');
                }
            } else {
                setErrorMessage("The user doesn't exist.");
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const handleModifySubmit = async () => {
        if (!modifyName || modifyDescription.length > 100) {
            setErrorMessage('Name cannot be empty and description must be under 100 characters.');
            return;
        }
        try {
            const response = await fetch(`/dashboards/${currentDashboard?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: modifyName, description: modifyDescription }),
            });
            if (response.ok) {
                setFeedbackMessage(`Dashboard ${currentDashboard?._id} updated successfully.`);
                setPopupType(null);
                setCurrentDashboard(null);
                setModifyName('');
                setModifyDescription('');
                fetchDashboards(localStorage.getItem('authToken') || '');
            } else {
                setErrorMessage('Failed to update dashboard. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const closePopup = () => {
        setPopupType(null);
        setCurrentDashboard(null);
        setErrorMessage(null);
        setInviteName('');
        setModifyName('');
        setModifyDescription('');
        setNewDashboardName('');
        setNewDashboardDescription('');
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
                            <div
                                key={dashboard._id}
                                className="dashboard-card"
                                onClick={() => handleDashboardSelect(dashboard._id)}
                            >
                                <h3>{dashboard.name}</h3>
                                <p>{dashboard.description}</p>
                                <div className="dashboard-card-buttons">
                                    <button
                                        className="dashboard-card-button invite-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleInviteUsers(dashboard);
                                        }}
                                    >
                                        Invite Users
                                    </button>
                                    {dashboard.creatorId === userId && (
                                        <button
                                            className="dashboard-card-button modify-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleModifyDashboard(dashboard);
                                            }}
                                        >
                                            Modify
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-dashboards-message">No dashboards available. Create a new one to get started!</div>
                    )}
                </div>
            </div>

            <button className="show-create-button" onClick={() => setPopupType('create')}>
                Create New Dashboard
            </button>

            {popupType && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        {popupType === 'invite' && (
                            <>
                                <h2>Invite Users</h2>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={inviteName}
                                    onChange={(e) => setInviteName(e.target.value)}
                                />
                                {currentDashboard?.invitedUsers && currentDashboard.invitedUsers.length > 0 ? (
                                    <div className="invited-users">
                                        <h3>Already Invited Users:</h3>
                                        <ul>
                                            {currentDashboard.invitedUsers.map((userId) => (
                                                <li key={userId}>{invitedUsernames[userId] || 'Fetching username...'}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="no-invited-users">No users have been invited yet.</p>
                                )}
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <div className="popup-buttons">
                                    <button className="submit-button" onClick={handleInviteSubmit}>
                                        Invite
                                    </button>
                                    <button className="cancel-button-form" onClick={closePopup}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                        {popupType === 'modify' && (
                            <>
                                <h2>Modify Dashboard</h2>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={modifyName}
                                    onChange={(e) => setModifyName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={modifyDescription}
                                    maxLength={100}
                                    onChange={(e) => setModifyDescription(e.target.value)}
                                />
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <div className="popup-buttons">
                                    <button className="submit-button" onClick={handleModifySubmit}>
                                        Save Changes
                                    </button>
                                    <button className="cancel-button-form" onClick={closePopup}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                        {popupType === 'create' && (
                            <>
                                <h2>Create a New Dashboard</h2>
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
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <div className="popup-buttons">
                                    <button className="submit-button" onClick={handleCreateDashboard}>
                                        Create
                                    </button>
                                    <button className="cancel-button-form" onClick={closePopup}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardSelector;
