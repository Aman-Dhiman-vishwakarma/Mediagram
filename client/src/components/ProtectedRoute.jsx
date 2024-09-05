import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const { currentUser } = useSelector((store) => store.auth);
    return currentUser ? children : <Navigate to="/login" />
  
}

export default ProtectedRoute
