import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth from AuthContext
import './Login.css';
import axios from "axios";

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from AuthContext
  const api = axios.create({baseURL: 'http://localhost:5000/'});

  const validateUsername = (username: string) => {
    const usernameRegex = /^[^\s]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setMessage('Username must be between 3-20 characters and must not contain spaces.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be between 8-30 characters, include 1 uppercase letter, and 1 symbol.');
      return;
    }

    try {
      const response = await api.post('auth/login',{
        username,
        password
      });

      if (response.status === 200) {
        const data = await response.data.json();
        login(data.token, data.userId); // Call login from AuthContext
        setMessage('Login successful!');
        navigate('/dashboardselector'); // Redirect to the dashboard selection page
      } else {
        const data = await response.data.json();
        setMessage(data.error || 'Failed to login. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred during login.');
      console.error('Login error:', error);
    }
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

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
