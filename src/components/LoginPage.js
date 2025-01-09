import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link  } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
                email: email,
                password: password
            });
            const token = response.data.token;
            const expiresIn = response.data.expiresIn; // Assuming the expiration time is returned as 'expiresIn'
            const expirationDate = new Date(new Date().getTime() + expiresIn);
            Cookies.set('token', token, { expires: expirationDate, secure: true });

            // Fetch user info and set it in context
            const userInfoResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("User info: " + JSON.stringify(userInfoResponse.data));
            setUser(userInfoResponse.data);

            // notify user before token expires
            const notificationTime = expiresIn - 300000;
            if (notificationTime > 0) {
                setTimeout(() => {
                    alert('Your session will expire in 5 minutes.');
                }, notificationTime);
            }

            // Auto logout when token expires
            setTimeout(() => {
                handleLogout();
            }, expiresIn);

            onLogin();
            navigate('/home');
        } catch (err) {
            console.error('Login failed', err);
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleLogout = () => {
        Cookies.remove('token');
        setUser(null);
        navigate('/login');
        alert('Session expired, please log in again.');
    };

    return (
        <Container className="log-in-page-container">
            <h2>Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin} className="mx-auto" style={{ maxWidth: '400px' }}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Login
                </Button>
            </Form>
            <p className="mt-3">
                Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
        </Container>
    );
}

export default LoginPage;