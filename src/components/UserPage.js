import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUser } from '../context/UserContext';
import '../customStyle.css';
import ProductCard from './ProductCard';
import { Row, Col } from 'react-bootstrap';

function UserPage() {
    const { user, setUser } = useUser();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [likedProducts, setLikedProducts] = useState([]);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            // If no token, redirect to login
            navigate('/login');
            return;
        }
        console.log("User ", user);
        if (!user) {
            // If user info is not available in context, fetch it
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get('http://localhost:8005/api/users/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response);
                    setUser(response.data); // Store the fetched user info in context
                } catch (error) {
                    console.error('Failed to fetch user info:', error);
                    // Redirect to login on error
                    navigate('/login');
                }
            };

            fetchUserInfo();
        }
    }, [user, setUser, navigate]);

     // Fetch products sold by the user
     useEffect(() => {
        if (user) {
            const fetchUserProducts = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}/products`, {
                        headers: {
                            Authorization: `Bearer ${Cookies.get('token')}`,
                        },
                    });
                    console.log("product: " + JSON.stringify(response.data, null, 2));
                    setProducts(response.data); // Store products in state
                    const likedResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}/liked-products`, {
                        headers: {
                            Authorization: `Bearer ${Cookies.get('token')}`,
                        },
                    });
                    const likedProductIds = likedResponse.data.map(product => product.id); // Store only product IDs
                    console.log("product: " + likedProductIds);
                    setLikedProducts(likedProductIds);
                } catch (error) {
                    console.error('Failed to fetch user products:', error);
                }
            };

            fetchUserProducts();
        }
    }, [user]);

    return (
        <div className="user-info-page-container">
            <div className="user-info">
                <h2>User Info</h2>
                {user ? (
                    <div>
                        <p><strong>Name:</strong> {user.fullName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role.name}</p>
                    </div>
                ) : (
                    <p>Loading user info...</p>
                )}
            </div>

            <div className="product-list">
                <h2>Listing Products</h2>
                {products.length > 0 ? (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {products.map((product) => (
                            <Col key={product.id}>
                                <ProductCard 
                                    product={product} 
                                    likedProducts={likedProducts} // Pass likedProducts if available
                                />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
}

export default UserPage;
