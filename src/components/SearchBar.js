import React from 'react';
import { Form } from 'react-bootstrap';

function SearchBar({ searchTerm, setSearchTerm }) {
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Form className="mb-3">
            <Form.Group controlId="searchBar">
                <Form.Control
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </Form.Group>
        </Form>
    );
}

export default SearchBar;
