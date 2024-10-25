import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Dashboard from './Dashboard/Dashboard';
import { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  const handleLogout = () => {
    setIsLoggedIn(false); // Set isLoggedIn to false to log out the user
  };

  return (
    <Router>
      <div>
        {/* Navigation bar that stays visible, but conditionally renders certain buttons */}
        <nav className="top-bar">
          <Link to="/" className="nav-link">Home</Link>

          {/* Conditionally show Login and Sign Up buttons if the user is not logged in */}
          {!isLoggedIn && (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}

          {/* Conditionally show Dashboard and Sign Out buttons if the user is logged in */}
          {isLoggedIn && (
  <>
    <Link to="/dashboard" className="nav-link">Dashboard</Link>
    <Link 
      to="/"  /* Redirect to home after logging out */
      className="nav-link signout-button" 
      onClick={handleLogout}
    >
      Sign Out
    </Link>
  </>
)}
        </nav>

        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

function Home({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="home-content">
      <h1>TaskFlow</h1>
      <p>TaskFlow makes project management simple and engaging. Easily create, assign, and track tasks, all in one place. With checklists, time frames, and comments, staying organized has never been easier.</p>
      <p>Boost your productivity with our fun gamification features: earn points, unlock achievements, and climb the leaderboards as you complete tasks. Task management, reimagined!</p>
      
      {/* Conditionally render the Signup and Login buttons only if the user is not logged in */}
      {!isLoggedIn && (
        <div className="button-container">
          <Link to="/signup">
            <button className="home-button signup-button">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="home-button login-button">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default App;
