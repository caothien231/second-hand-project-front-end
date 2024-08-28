import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8005/auth/login', {
                email: email,
                password: password
            });
            const token = response.data.token;
            const expiresIn = response.data.expiresIn; // Assuming the expiration time is returned as 'expiresIn'
            console.log("expiresIn", expiresIn);
            console.log("curr time", new Date(new Date().getTime()));
            const expirationDate = new Date(new Date().getTime() + expiresIn);
            console.log("time", expirationDate);
            setToken(token);
            setError('');

            // Set the token with expiration
            Cookies.set('token', token, { expires: expirationDate, secure: true });

            navigate('/home');
        } catch (err) {
            console.error('Login failed', err);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {token && (
                <div>
                    <h3>Token:</h3>
                    <p>{token}</p>
                </div>
            )}
            {error && (
                <div>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default LoginPage;