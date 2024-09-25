import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HealthStatus from './components/HealthStatus';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import HomePage from './components/HomePage';
import AppNavbar from './components/AppNavbar';
import Cookies from 'js-cookie';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        Cookies.remove('token'); // Clear the token on logout
    };

    return (
        <Router>
            <div className="App">
                <AppNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                <Routes>
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/home/*" element={<HomePage />} />
                    <Route path="/user-page/*" element={<UserPage />} />
                    {/* Add other routes here */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;