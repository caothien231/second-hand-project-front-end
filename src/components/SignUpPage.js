import React, { useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../customStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignUpPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:8005/auth/signup', {
                fullName: fullName,
                email: email,
                password: password,
            });
            setSuccess('Sign up successful! You can now log in.');
            setFullName('');
            setEmail('');
            setPassword('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Sign up failed', err);
            setError('Sign up failed. Please check your details and try again.');
        }
    };

    return (
        <Container className="sign-up-page-container">
            <h2>Sign Up</h2>
            <Form onSubmit={handleSignUp}>
                <Form.Group controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">Sign Up</Button>
            </Form>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
        </Container>
    );
}

export default SignUpPage;