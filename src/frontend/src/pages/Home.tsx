import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-content">
            <h1>TaskFlow</h1>
            <p>TaskFlow makes project management simple and engaging. Easily create, assign, and track tasks, all in one place. With checklists, time frames, and comments, staying organized has never been easier.</p>
            <p>Boost your productivity with our fun gamification features: earn points, unlock achievements, and climb the leaderboards as you complete tasks. Task management, reimagined!</p>

            {!isAuthenticated && (
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
};

export default Home;
