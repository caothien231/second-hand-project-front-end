import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Spinner, Carousel } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';
import moment from 'moment';

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
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/get/${productId}`);
                const fetchedProduct = response.data;
                setProduct(fetchedProduct);

                if (token && user) {
                    // Fetch the liked products list if the user is logged in
                    const likedProductsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}/liked-products`, {
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
    }, [productId]);

    const handleLikeToggle = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isLiked) {
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}/unlike-product/${product.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsLiked(false);
            } else {
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}/like/${product.id}`, {}, {
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
            navigate('/login');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.id}/buy-product/${product.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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

    const getListingDuration = (createdDate) => {
        const momentDate = moment(createdDate);
        return momentDate.fromNow();
    };

    return (
        <div className="product-detail-container mt-5">
            {product && (
                <Row className="gx-5">
                    {/* Left Part - Image Carousel */}
                    <Col md={7}>
                        <Card className="shadow-sm border-0">
                            <Carousel>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100 rounded"
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                                    />
                                </Carousel.Item>
                            </Carousel>
                        </Card>
                    </Col>

                    {/* Right Part - Product Details */}
                    <Col md={5}>
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h1 className="fw-bold">{product.name}</h1>
                                <h3 className="text-success fw-bold mt-2">${product.price.toFixed(2)}</h3>
                                <p className="text-muted">{getListingDuration(product.createdDate)}</p>

                                <Card.Text className="mt-4">
                                    <strong>Description:</strong> {product.description}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Status:</strong> {product.status}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Seller:</strong> {product.seller.fullName}
                                </Card.Text>

                                <div className="button-group-container mt-5">
    <Button
        variant={isLiked ? "danger" : "primary"}
        onClick={handleLikeToggle}
        style={isLiked ? { backgroundColor: 'pink' } : {}}
    >
        {isLiked ? 'Unlike' : 'Like'}
    </Button>
    <Button
        variant="success"
        onClick={handleBuy}
    >
        Buy Now
    </Button>
    <Button
        variant="secondary"
        onClick={() => window.history.back()}
    >
        Back
    </Button>
</div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default ProductDetail;
