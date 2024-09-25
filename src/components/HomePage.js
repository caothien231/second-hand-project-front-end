import React from 'react';
import { useNavigate, Link, Route, Routes } from 'react-router-dom';
import UserInfo from './UserInfo';
import AllUsers from './AllUsers';
import Cookies from 'js-cookie';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './AppNavbar';

function HomePage() {
    return (
        <div>
            <Routes>
                <Route path="user-info" element={<UserInfo />} />
                <Route path="all-users" element={<AllUsers />} />
            </Routes>
        </div>
    );
}

export default HomePage;