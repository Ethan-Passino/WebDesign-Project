import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;

const UserProfile: React.FC = () => {
    const [currentUsername, setCurrentUsername] = useState('');
    const [userPoints, setUserPoints] = useState<number>(0); // State for user's points
    const [showChangeUsernamePopup, setShowChangeUsernamePopup] = useState(false);
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [confirmNewUsername, setConfirmNewUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('authToken');
                
                if (!userId || !token) {
                    setMessage('User not authenticated.');
                    setMessageType('error');
                    return;
                }

                const response = await fetch(`/auth/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setCurrentUsername(data.username);
                    setUserPoints(data.points || 0); // Fetch points from the backend
                } else {
                    setMessage(data.error || 'Error fetching user data.');
                    setMessageType('error');
                }
            } catch (error) {
                setMessage('An error occurred while fetching user data.');
                setMessageType('error');
            }
        };
        fetchUserProfile();
    }, []);

    const resetState = (actionMessage: string, type: 'success' | 'error') => {
        setShowChangeUsernamePopup(false);
        setShowChangePasswordPopup(false);
        setNewUsername('');
        setConfirmNewUsername('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setMessage(actionMessage);
        setMessageType(type);
    };

    const clearMessage = () => {
        setMessage('');
        setMessageType('');
    };

    const handleUpdateUsername = async () => {
        if (newUsername === currentUsername) {
            setMessage('The new username cannot be the same as the current username.');
            setMessageType('error');
            return;
        }

        if (newUsername !== confirmNewUsername) {
            setMessage('New usernames do not match.');
            setMessageType('error');
            return;
        }

        try {
            const response = await fetch('/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    newUsername,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setCurrentUsername(newUsername);
                resetState('Username updated successfully.', 'success');
            } else if (data.error === 'Username already taken') {
                setMessage('The username you entered is already in use. Please try another one.');
                setMessageType('error');
            } else {
                setMessage(data.error || 'Error updating username.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('An error occurred while updating the username.');
            setMessageType('error');
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmNewPassword) {
            setMessage('Both new password and confirm password are required.');
            setMessageType('error');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setMessage('New passwords do not match.');
            setMessageType('error');
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setMessage('Password must contain at least one uppercase letter, one special character, and be between 8-30 characters.');
            setMessageType('error');
            return;
        }

        try {
            const response = await fetch('/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                resetState('Password updated successfully.', 'success');
            } else {
                setMessage(data.error || 'Error updating password.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('An error occurred while updating the password.');
            setMessageType('error');
        }
    };

    return (
        <div className="user-profile-container">
            <br></br>
            {message && (
                <div className={`message-box ${messageType}`}>
                    <p>{message}</p>
                </div>
            )}

            <h2>User Profile</h2>

            <div className="current-username">
                <p><strong>Current Username:</strong> {currentUsername}</p>
                <p><strong>Points:</strong> {userPoints}</p> {/* Display user's points */}
            </div>

            {!showChangeUsernamePopup && !showChangePasswordPopup && (
                <div className="button-container">
                    <button
                        className="action-button"
                        onClick={() => {
                            clearMessage();
                            setShowChangeUsernamePopup(true);
                        }}
                    >
                        Change Username
                    </button>
                    <button
                        className="action-button"
                        onClick={() => {
                            clearMessage();
                            setShowChangePasswordPopup(true);
                        }}
                    >
                        Change Password
                    </button>
                </div>
            )}

            {showChangeUsernamePopup && (
                <div className="popup">
                    <h3>Change Username</h3>
                    <div className="form-group">
                        <label>New Username:</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Username:</label>
                        <input
                            type="text"
                            value={confirmNewUsername}
                            onChange={(e) => setConfirmNewUsername(e.target.value)}
                        />
                    </div>
                    <div className="button-container">
                        <button className="action-button" onClick={handleUpdateUsername}>Submit</button>
                        <button
                            className="cancel-button"
                            onClick={() => resetState('Username change canceled.', 'error')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showChangePasswordPopup && (
                <div className="popup">
                    <h3>Change Password</h3>
                    <div className="form-group">
                        <label>Current Password:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password:</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="button-container">
                        <button className="action-button" onClick={handleUpdatePassword}>Submit</button>
                        <button
                            className="cancel-button"
                            onClick={() => resetState('Password change canceled.', 'error')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
