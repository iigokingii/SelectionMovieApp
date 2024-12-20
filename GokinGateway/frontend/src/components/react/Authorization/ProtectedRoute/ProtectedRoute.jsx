import { useSelector } from "react-redux";
import React, { useEffect } from 'react';

import { useNavigate } from "react-router-dom";
import _ from 'lodash';
const ProtectedRoute = ({ element: Component, roles, ...rest }) => {
    const credentials = useSelector((state) => state.credentialReducer.credentials);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (credentials) {
            setLoading(false);
        }
    }, [credentials]);

    if (loading) {
        return <div>Loading...</div>;
    }
    
    const hasRequiredRole = roles ? roles.includes(credentials?.role) : true;
    if (!hasRequiredRole) {
        navigate('/forbidden');
        return null;
    }
    
    return Component;
};

export default ProtectedRoute;
