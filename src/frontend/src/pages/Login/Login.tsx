import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import React from 'react';

function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validateUsername = (username: string) => {
    const usernameRegex = /^[^\s]{3,20}$/; // No spaces, between 3 and 20 characters
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/; // At least 1 uppercase letter, 1 symbol, and 8-30 characters
    return passwordRegex.test(password);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username
    if (!validateUsername(username)) {
      setMessage('Username must be between 3-20 characters and must not contain spaces.');
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setMessage('Password must be between 8-30 characters, include 1 uppercase letter, and 1 symbol.');
      return;
    }

    // If both are valid
    setMessage('Login successful!');
    onLogin(); // Call the function to update the login state in App
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {/* Display message (error or success) */}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
