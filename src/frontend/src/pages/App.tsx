import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Dashboard from './Dashboard/Dashboard';
import DashboardSelection from './DashboardSelection/DashboardSelection';
import Home from './Home';
import UserProfile from './UserProfile/UserProfile';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          {/* Navigation bar */}
          <NavBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<RedirectIfAuthenticated component={<Login />} />} />
            <Route path="/signup" element={<RedirectIfAuthenticated component={<Signup />} />} />
            {/* Dynamic route for individual dashboards */}
            <Route path="/dashboard/:dashboardId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboardselector" element={<ProtectedRoute><DashboardSelection /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Navigation bar with conditional rendering based on login status
function NavBar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="top-bar">
      <Link to="/" className="nav-link">Home</Link>

      {!isAuthenticated ? (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </>
      ) : (
        <>
          <Link to="/dashboardselector" className="nav-link">Dashboards</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/" className="nav-link signout-button" onClick={logout}>Sign Out</Link>
        </>
      )}
    </nav>
  );
}

// RedirectIfAuthenticated: Redirects logged-in users to dashboard selector if they try to access login or signup
function RedirectIfAuthenticated({ component }: { component: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboardselector" /> : component;
}

// Protect specific routes to allow access only if authenticated
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App;
