import { useState } from 'react';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // New state to track success or error

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the input (just an example, you can add more validation)
    if (!username || !password) {
      setMessage('Please fill in all fields.');
      setIsSuccess(false);
      return;
    }

    // If no errors, display success message immediately
    setMessage('Login successful!');
    setIsSuccess(true); // Mark as success
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
        {message && (
          <p className={`message ${isSuccess ? 'success' : ''}`}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
