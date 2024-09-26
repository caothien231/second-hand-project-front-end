import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../context/UserContext';

function UploadProductPage() {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { user } = useUser();

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // if (!imageFile) {
        //     setError('Please upload an image.');
        //     return;
        // }

        // First, upload the image
        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            // const imageResponse = await axios.post('http://localhost:8005/api/products/upload-image', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // const imageUrl = imageResponse.data; // Get the image URL from response

            // Now, submit the product details along with the image URL
            const productData = {
                name: productName,
                price: productPrice,
                description: productDescription,
                sellerId: user.id, 
                status: 'AVAILABLE',
                // imageUrl: imageUrl, // Attach image URL to product data
            };

            await axios.post('http://localhost:8005/api/products/create', productData);
            
            setSuccess('Product uploaded successfully!');
            setError('');
            setProductName('');
            setProductPrice('');
            setProductDescription('');
            setImageFile(null);
            navigate('/home'); // Navigate to the products page after successful upload
        } catch (err) {
            console.error('Failed to upload product', err);
            setError('Failed to upload product. Please try again.');
            setSuccess('');
        }
    };

    return (
        <Container className="mt-5">
            <h2>Upload Product</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
                <Form.Group controlId="productName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="productPrice" className="mt-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter product price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="productDescription" className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter product description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formFile" className="mt-3">
                    <Form.Label>Product Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Upload Product
                </Button>
            </Form>
        </Container>
    );
}

export default UploadProductPage;
