import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = Cookies.get('token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setError('You do not have permission to view this page.');
                } else {
                    console.error('Failed to fetch users:', err);
                    setError('Failed to load users.');
                }
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h2>All Users</h2>
            {error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.fullName} ({user.email}) - Role: {user.role.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AllUsers;