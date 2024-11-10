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
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setMessage('Login successful!');
        onLogin(); // Update login state in the parent component
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setMessage(data.error);
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
}

export default Login;
