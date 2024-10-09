import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';

function ProductDetail() {
    const { productId } = useParams();
    const { user } = useUser();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch the product data
                const response = await axios.get(`http://localhost:8005/api/products/get/${productId}`);
                const fetchedProduct = response.data;
                setProduct(fetchedProduct);

                if (token && user) {
                    // Fetch the liked products list if the user is logged in
                    const likedProductsResponse = await axios.get(`http://localhost:8005/api/users/${user.id}/liked-products`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const likedProducts = likedProductsResponse.data.map(product => product.id);

                    // Check if the fetched product is in the liked products list
                    if (fetchedProduct && likedProducts.includes(fetchedProduct.id)) {
                        setIsLiked(true);
                    } else {
                        setIsLiked(false);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setError('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, token, user]);

    const handleLikeToggle = async () => {
        if (!user) {
            // If no user, redirect to signup
            navigate('/signup');
            return;
        }

        try {
            if (isLiked) {
                // Unlike the product
                await axios.delete(`http://localhost:8005/api/users/${user.id}/unlike-product/${product.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsLiked(false);
            } else {
                // Like the product
                await axios.post(`http://localhost:8005/api/users/${user.id}/like/${product.id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error toggling like status:', error);
        }
    };

    const handleBuy = async () => {
        if (!user) {
            // If no user, redirect to signup
            navigate('/signup');
            return;
        }

        try {
            await axios.post(`http://localhost:8005/api/users/${user.id}/buy-product/${product.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Redirect to Thank You page after successful purchase
            navigate('/thank-you');
        } catch (error) {
            console.error('Failed to buy product:', error);
        }
    };

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
                        <Button
                            variant={isLiked ? "danger" : "primary"}
                            onClick={handleLikeToggle}
                            style={isLiked ? { backgroundColor: 'pink' } : {}}
                            className="me-2"
                        >
                            {isLiked ? 'Unlike' : 'Like'}
                        </Button>
                        <Button variant="success" onClick={handleBuy}>
                            Buy Now
                        </Button>
                        <Button variant="primary" onClick={() => window.history.back()} className="ms-2">
                            Back to Products
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}

export default ProductDetail;
