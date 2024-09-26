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
            const response = await axios.post('http://localhost:8005/auth/login', {
                email: email,
                password: password
            });
            const token = response.data.token;
            const expiresIn = response.data.expiresIn; // Assuming the expiration time is returned as 'expiresIn'
            const expirationDate = new Date(new Date().getTime() + expiresIn);
            Cookies.set('token', token, { expires: expirationDate, secure: true });

            // Fetch user info and set it in context
            const userInfoResponse = await axios.get('http://localhost:8005/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("User info: " + JSON.stringify(userInfoResponse.data));
            setUser(userInfoResponse.data);

            onLogin(); // Call the callback to update the login state in parent
            navigate('/home');
        } catch (err) {
            console.error('Login failed', err);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container className="mt-5">
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