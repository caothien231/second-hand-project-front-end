import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, ListGroup, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = Cookies.get('token');
            try {
                const response = await axios.get('http://localhost:8005/api/users/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.log(err);
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
        <Container className="mt-4">
            <h2>User List</h2>
            {error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {users.map((user) => (
                        <Col key={user.id}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>{user.fullName}</Card.Title>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item><strong>Email:</strong> {user.email}</ListGroup.Item>
                                        <ListGroup.Item><strong>Role:</strong> {user.role.name}</ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Status:</strong> {user.enabled ? 'Enabled' : 'Disabled'}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default UserList;
