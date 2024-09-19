import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function HealthStatus() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHealthStatus = async () => {
            const token = Cookies.get('token');
            try {
                const response = await axios.get('http://localhost:8005/api/health', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStatus(response.data.status);
                setLoading(false);
            }  catch (error) {
                console.error('There was an error fetching the health status!', error);
                setError('Error fetching status');
                setLoading(false);
            }
        };

        fetchHealthStatus();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Application Status</h2>
            <p>Status: {status}</p>
        </div>
    );
}

export default HealthStatus;