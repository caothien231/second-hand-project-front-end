import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = Cookies.get('token');
            try {
                const response = await axios.get('http://localhost:8005/users/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                if (err.response) {
                    // Server responded with a status other than 200 range
                    if (err.response.status === 401) {
                        setError('Unauthorized: Please log in to access this resource.');
                    } else if (err.response.status === 403) {
                        setError('Forbidden: You do not have permission to access this resource.');
                    } else {
                        setError(`Error: ${err.response.status} - ${err.response.data.message}`);
                    }
                } else if (err.request) {
                    // Request was made but no response received
                    setError('Network error: Failed to get a response from the server.');
                } else {
                    // Something else happened
                    setError('An unexpected error occurred.');
                }
                console.error('Failed to fetch users:', err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h2>User List</h2>
            {error ? <p>{error}</p> : (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <p>Name: {user.fullName}</p>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role.name}</p>
                            <p>Status: {user.enabled ? 'Enabled' : 'Disabled'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserList;