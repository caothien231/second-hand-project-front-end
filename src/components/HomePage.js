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
    const { user, setUser } = useUser();
    const [products, setProducts] = useState([]);
    const [likedProducts, setLikedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const token = Cookies.get('token'); // Get token from cookies

    useEffect(() => {
        const fetchUserAndProducts = async () => {
            if (!user && token) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(response.data);
                } catch (err) {
                    console.error("Failed to restore user session: ", err);
                    setError('Failed to restore session. Please log in again.');
                }
            }
    
            try {
                // Fetch all available products
                const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/`);
                const availableProducts = productResponse.data.filter(product => product.status === 'AVAILABLE');
                setProducts(availableProducts);
    
                // If a user is logged in, fetch their liked products
                if (user && user.id) {
                    const likedResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}/liked-products`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const likedProductIds = likedResponse.data.map(product => product.id);
                    setLikedProducts(likedProductIds);
                } else {
                    setLikedProducts([]);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserAndProducts();
    }, [token, user]);

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
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Col key={product.id}>
                            <ProductCard product={product} likedProducts={likedProducts} />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Text>No products found for "{searchTerm}".</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
            <Routes>
                <Route path="user-info" element={<UserInfo />} />
                <Route path="all-users" element={<AllUsers />} />
            </Routes>
        </div>
    );
}

export default HomePage;
