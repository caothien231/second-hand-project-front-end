import React, { useState, useEffect  } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AppNavbar({ isLoggedIn, onLogout }) {
    const [expanded, setExpanded] = useState(false);
    const handleToggle = () => {
        setExpanded(!expanded);
    };
    const handleLinkClick = () => {
        setExpanded(false); // Collapse the navbar
    };
    const handleLogout = () => {
        onLogout(); // Call the logout function from props
        handleLinkClick(); // Collapse the navbar
    };
    return (
        <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded}>
            <Navbar.Brand as={Link} to="/home" onClick={handleLinkClick}>Logo</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {!isLoggedIn ? (
                        <>
                            <Nav.Link as={Link} to="/login" onClick={handleLinkClick}>Login</Nav.Link>
                            <Nav.Link as={Link} to="/signup" onClick={handleLinkClick}>Sign Up</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/user-info" onClick={handleLinkClick}>User Info</Nav.Link>
                            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNavbar;