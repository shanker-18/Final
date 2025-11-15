import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="gold.400" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
