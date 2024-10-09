import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Cookies from 'js-cookie';

function ProductCard({ product, likedProducts }) {
    // console.log("product: " + JSON.stringify(product));
    // console.log("product: " + likedProducts);
    const { user } = useUser();
    const [isLiked, setIsLiked] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    // console.log("product: " + isLiked + " like " + product.id);

    useEffect(() => {
        setIsLiked(likedProducts.includes(product.id));
    }, [likedProducts, product.id]);

    const handleLikeToggle = async () => {
        try {
            if (!user) {
                // If no user, redirect to signup
                navigate('/signup');
                return;
            }
            if (isLiked) {
                // Unlike the product http://localhost:8005/api/users/${user.id}/unlike-product/${product.id}
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

    return (
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
                <Button variant="primary" onClick={() => navigate(`/product/${product.id}`)}>
                    Details
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;