import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUser } from '../context/UserContext';

function UserPage() {
    const { user, setUser } = useUser();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            // If no token, redirect to login
            navigate('/login');
            return;
        }

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
                    const response = await axios.get(`http://localhost:8005/api/users/${user.id}/products`, {
                        headers: {
                            Authorization: `Bearer ${Cookies.get('token')}`,
                        },
                    });
                    console.log("product: " + JSON.stringify(response.data, null, 2));
                    setProducts(response.data); // Store products in state
                } catch (error) {
                    console.error('Failed to fetch user products:', error);
                }
            };

            fetchUserProducts();
        }
    }, [user]);

    return (
        <div style={styles.container}>
            <div style={styles.userInfo}>
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

            <div style={styles.productList}>
                <h2>Listing Products</h2>
                {products.length > 0 ? (
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                <p><strong>Name:</strong> {product.name}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>Status:</strong> {product.status}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
    },
    userInfo: {
        width: '45%',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
    productList: {
        width: '45%',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
};

export default UserPage;