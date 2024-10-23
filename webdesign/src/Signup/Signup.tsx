import { useState } from 'react';
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // New state to track success or error

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password || !confirmPassword) {
      setMessage('Please fill in all fields.');
      setIsSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    // If no errors, display success message immediately
    setMessage('Signup successful!');
    setIsSuccess(true); // Mark as success
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Sign Up</h2>
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

        {/* Display message (error or success) */}
        {message && (
          <p className={`message ${isSuccess ? 'success' : ''}`}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default Signup;
