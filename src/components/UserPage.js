import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUser } from '../context/UserContext';

function UserPage() {
    const { user, setUser } = useUser(); // Access user from context
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            // If no token, redirect to login
            navigate('/login');
            return;
        }

        if (!user) {
            // If user info is not available in context, fetch it
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get('http://localhost:8005/api/users/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response);
                    setUser(response.data); // Store the fetched user info in context
                } catch (error) {
                    console.error('Failed to fetch user info:', error);
                    // Redirect to login on error
                    navigate('/login');
                }
            };

            fetchUserInfo();
        }
    }, [user, setUser, navigate]);

    return (
        <div>
            <h2>User Info</h2>
            {user ? (
                <div>
                    <p>Name: {user.fullName}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role.name}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserPage;