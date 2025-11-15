import React, { useState } from 'react';
import { Input, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        // Redirect to user profile based on search term
        navigate(`/user/${searchTerm}`);
    };

    return (
        <VStack spacing={4}>
            <Input placeholder="Search for a user..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button onClick={handleSearch}>Search</Button>
        </VStack>
    );
};

export default UserSearch; 