import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function UserInfo() {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // const token = Cookies.get('token');
        // if (!token) {
        //     // If no token, redirect to login
        //     navigate('/login');
        //     return;
        // }

        const fetchUserInfo = async () => {
            const token = Cookies.get('token');
            try {
                const response = await axios.get('http://localhost:8005/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response);
                setUserInfo(response.data);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                //redirect to login on error
                navigate('/login');
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div>
            <h2>User Info</h2>
            {userInfo ? (
                <div>
                    <p>Name: {userInfo.fullName}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Role: {userInfo.role.name}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default UserInfo;