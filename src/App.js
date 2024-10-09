import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HealthStatus from './components/HealthStatus';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import HomePage from './components/HomePage';
import AppNavbar from './components/AppNavbar';
import Cookies from 'js-cookie';
import SignUpPage from './components/SignUpPage';
import UploadProductPage from './components/UploadProductPage';
import ProductDetail from './components/ProductDetail';
import ThankYouPage from './components/ThankYouPage';
import UserList from './components/UserList';


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
        window.location.reload();
    };

    return (
        <Router>
            <div className="App">
                <AppNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                <Routes>
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/home/*" element={<HomePage />} />
                    <Route path="/user-page/*" element={<UserPage />} />
                    <Route path="/upload-product/*" element={<UploadProductPage />} />
                    <Route path="/product/:productId" element={<ProductDetail />} />
                    <Route path="/users" element={<UserList/>} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                    {/* Add other routes here */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;