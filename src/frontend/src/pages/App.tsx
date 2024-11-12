import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Dashboard from './Dashboard/Dashboard';
import DashboardSelection from './DashboardSelection/DashboardSelection';
import Home from './Home'
import { AuthProvider, useAuth } from './AuthContext'; // Import AuthContext and AuthProvider
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboardselector" element={<ProtectedRoute><DashboardSelection /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Navigation Bar with conditional rendering based on login status
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
          <Link to="/" className="nav-link signout-button" onClick={logout}>Sign Out</Link>
        </>
      )}
    </nav>
  );
}

// ProtectedRoute component to protect routes based on authentication status
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App;
