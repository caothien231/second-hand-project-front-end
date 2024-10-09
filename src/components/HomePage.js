import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserInfo from './UserPage';
import AllUsers from './AllUsers';
import axios from 'axios';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './SearchBar';
import '../customStyle.css';
import ProductCard from './ProductCard';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';

function HomePage() {
    const { user } = useUser(); // Get the user from context
    const [products, setProducts] = useState([]);
    const [likedProducts, setLikedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const token = Cookies.get('token');  // Get token from cookies
    const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Keep track of login status

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all available products
                const response = await axios.get('http://localhost:8005/api/products/');
                const availableProducts = response.data.filter(product => product.status === 'AVAILABLE');
                setProducts(availableProducts);

                // If a user is logged in, fetch their liked products
                if (isLoggedIn && token) {
                    console.log("USER ID " + user.id);
                    const likedResponse = await axios.get(`http://localhost:8005/api/users/${user.id}/liked-products`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const likedProductIds = likedResponse.data.map(product => product.id); // Store only product IDs
                    console.log("product: " + likedProductIds);
                    setLikedProducts(likedProductIds);
                } else {
                    // Reset liked products if no user is logged in
                    setLikedProducts([]);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token, isLoggedIn]);  // Re-run the effect if the token or user changes

    // Filter products based on the search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="home-page-container">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <h2>Products</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {filteredProducts.map((product) => (
                    <Col key={product.id}>
                        <ProductCard product={product} likedProducts={likedProducts} /> {/* Pass likedProducts */}
                    </Col>
                ))}
            </Row>
            <Routes>
                <Route path="user-info" element={<UserInfo />} />
                <Route path="all-users" element={<AllUsers />} />
            </Routes>
        </div>
    );
}

export default HomePage;
