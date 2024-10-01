import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Spinner, Button } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';

function ProductDetail() {
    const { productId } = useParams(); // Get the productId from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useUser(); 
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8005/api/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProduct(response.data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setError('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, token]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="product-detail-container">
            {product && (
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
                        <Button variant="primary" onClick={() => window.history.back()}>
                            Back to Products
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}

export default ProductDetail;