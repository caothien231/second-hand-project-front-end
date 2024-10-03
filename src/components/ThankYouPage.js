import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function ThankYouPage() {
    const navigate = useNavigate();

    return (
        <div className="thank-you-page text-center">
            <h2>Thank You for Your Purchase!</h2>
            <p>We appreciate your purchase. Would you like to return to the home page?</p>
            <Button variant="primary" onClick={() => navigate('/home')}>
                Go to Home Page
            </Button>
        </div>
    );
}

export default ThankYouPage;
