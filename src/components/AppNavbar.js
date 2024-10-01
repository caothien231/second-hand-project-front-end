import React, { useState, useEffect  } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AppNavbar({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const handleToggle = () => {
        setExpanded(!expanded);
    };
    const handleLinkClick = () => {
        setExpanded(false); 
    };
    const handleLogout = () => {
        onLogout(); 
        handleLinkClick(); 
        navigate('/home');
    };
    return (
        <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded}  fixed="top">
            <Navbar.Brand as={Link} to="/home" onClick={handleLinkClick}>Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    {!isLoggedIn ? (
                        <>
                            <Nav.Link as={Link} to="/login" onClick={handleLinkClick}>Login</Nav.Link>
                            <Nav.Link as={Link} to="/signup" onClick={handleLinkClick}>Sign Up</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/home" onClick={handleLinkClick}>Home</Nav.Link>
                            <Nav.Link as={Link} to="/user-page" onClick={handleLinkClick}>User Info</Nav.Link>
                            <Nav.Link as={Link} to="/upload-product" onClick={handleLinkClick}>Upload Product</Nav.Link>
                            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNavbar;