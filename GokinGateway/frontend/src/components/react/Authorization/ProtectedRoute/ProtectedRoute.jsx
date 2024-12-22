import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, roles, ...rest }) => {
    const credentials = useSelector((state) => state.credentialReducer.credentials);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (credentials) {
            setLoading(false);
        }
    }, [credentials]);

    useEffect(() => {
        if (!loading) {
            const hasRequiredRole = roles ? roles.includes(credentials?.role) : true;
            
            if (!hasRequiredRole && location.pathname !== '/sign-in' && location.pathname !== '/logout' && location.pathname !== '/sign-up') {
                console.log('sadadasdasdasdas');
                navigate('/forbidden');
            }
        }
    }, [loading, credentials, roles, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const hasRequiredRole = roles ? roles.includes(credentials?.role) : true;
    if (!hasRequiredRole) {
        return null;
    }

    return Component;
};

export default ProtectedRoute;
