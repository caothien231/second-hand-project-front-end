import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserInfo from './UserPage';
import AllUsers from './AllUsers';
import axios from 'axios';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './AppNavbar';
import SearchBar from './SearchBar';


function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8005/api/products/');
                const availableProducts = response.data.filter(product => product.status === 'AVAILABLE');
                console.log(JSON.stringify(availableProducts));
                setProducts(availableProducts);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                        <Card>
                            {product.imageUrl ? (
                                <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
                            ) : (
                                <Card.Img variant="top" src="https://via.placeholder.com/150" alt="No Image Available" />
                            )}
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>
                                    <strong>Price:</strong> ${product.price.toFixed(2)}<br />
                                    <strong>Description:</strong> {product.description}<br />
                                    <strong>Status:</strong> {product.status}<br />
                                    <strong>Seller:</strong> {product.seller.fullName}<br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
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
