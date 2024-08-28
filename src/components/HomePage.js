import React from 'react';
import { useNavigate, Link, Route, Routes } from 'react-router-dom';
import UserInfo from './UserInfo';
import AllUsers from './AllUsers';
import Cookies from 'js-cookie';

function HomePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the JWT token from cookies
        Cookies.remove('token'); // Use the correct cookie name

        // Redirect to the login page
        navigate('/login');
    };
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="user-info">User Info</Link>
                    </li>
                    <li>
                        <Link to="all-users">All Users</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="user-info" element={<UserInfo />} />
                <Route path="all-users" element={<AllUsers />} />
            </Routes>
        </div>
    );
}

export default HomePage;