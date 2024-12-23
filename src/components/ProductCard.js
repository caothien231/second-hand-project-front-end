import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';
import '../customStyle.css';

function ProductCard({ product, likedProducts }) {
    const { user } = useUser();
    const [isLiked, setIsLiked] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        setIsLiked(likedProducts.includes(product.id));
    }, [likedProducts, product.id]);

    const handleLikeToggle = async () => {
        try {
            if (!user) {
                navigate('/signup');
                return;
            }
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

    return (
        <Card className="h-100">
            <Card.Img
                variant="top"
                src={product.imageUrl ? product.imageUrl : "https://via.placeholder.com/150"}
                alt={product.name}
                className="product-image"
            />
            <Card.Body className="card-body">
                <Card.Title>{product.name}</Card.Title>
                <div className="card-text-container">
                    <Card.Text>
                        <strong>Price:</strong> ${product.price.toFixed(2)}<br />
                        <div className="description-container">
                            <strong>Description:</strong> {product.description}
                        </div>
                        <strong>Status:</strong> {product.status}<br />
                        <strong>Seller:</strong> {product.seller.fullName}<br />
                    </Card.Text>
                    <div>
                        <Button
                            variant={isLiked ? "danger" : "primary"}
                            onClick={handleLikeToggle}
                            style={isLiked ? { backgroundColor: 'pink' } : {}}
                            className="me-2"
                        >
                            {isLiked ? 'Unlike' : 'Like'}
                        </Button>
                        <Button variant="primary" onClick={() => navigate(`/product/${product.id}`)}>
                            Details
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;