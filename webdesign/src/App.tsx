import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Dashboard from './Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="top-bar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={ <Dashboard /> }></Route>
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-content">
      <h1>TaskFlow</h1>
      <p>TaskFlow makes project management simple and engaging. Easily create, assign, and track tasks, all in one place. With checklists, time frames, and comments, staying organized has never been easier.</p>
      <p>Boost your productivity with our fun gamification features: earn points, unlock achievements, and climb the leaderboards as you complete tasks. Task management, reimagined!</p>
            {/* Signup and Login buttons */}
      <div className="button-container">
        <Link to="/signup">
          <button className="home-button signup-button">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="home-button login-button">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default App;
