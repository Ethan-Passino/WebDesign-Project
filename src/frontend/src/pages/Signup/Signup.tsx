import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import React from 'react';
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const api = axios.create({baseURL: 'http://localhost:5000'});

  const validateUsername = (username: string) => {
    const usernameRegex = /^\S{3,20}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setMessage('Username must be between 3-20 characters and must not contain spaces.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must be between 8-30 characters, include 1 uppercase letter, and 1 symbol.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await api.post(`/auth/signup`,{
        username,
        password
      });

      if (response.status === 200) {
        setMessage('Signup successful!');
        navigate('/login');
      } else {
        const data = await response.data.json();
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('An error occurred during signup.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Sign Up</h2>

        <div className="requirements-box">
          <p><strong>Username Requirements:</strong> Must be between 3-20 characters, no spaces.</p>
          <p><strong>Password Requirements:</strong> Must be between 8-30 characters, contain at least 1 uppercase letter, and 1 symbol.</p>
        </div>

        <form className="signup-form" onSubmit={handleSignup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Sign Up</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Signup;
