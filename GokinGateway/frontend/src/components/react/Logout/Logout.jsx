import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setCredentials } from '../../redux/Auth/Action';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const logout = async () => {
            const response = await fetch('http://localhost:8082/authservice/api/auth/logout', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                dispatch(setCredentials({}));
                console.log('User logged out successfully');
                navigate('/sign-in'); 
            } else {
                const error = await response.json();
                console.log('Error during logout:', error);
            }
        };

        logout();
    }, [dispatch, navigate]);

    return <div>Logging out...</div>;
};

export default Logout;
