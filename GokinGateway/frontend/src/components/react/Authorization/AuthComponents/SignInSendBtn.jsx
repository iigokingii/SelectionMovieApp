import React,  { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setError } from '../../../redux/Input/action'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { setCredentials } from "../../../redux/Auth/Action";

const SignInSendBtn = () => {
    const navigate = useNavigate();
    const inputValues = useSelector((state) => state.inputReducer.inputValues);


    const username = inputValues.username;
    const password = inputValues.password;
    const dispatch = useDispatch();
    const handleError = (field, errorMsg) => {
        dispatch(setError(field, errorMsg));
    }
    useEffect(() => {
        return () => {
            handleError('emailError', '');
            handleError('usernameError', '');
            handleError('passwordError', '');
            handleError('passwordsError', '');
        };
    }, [navigate, dispatch]);

    const handleSubmit = async () => {
        console.log({ username: username, password: password });
        try {
            const response = await fetch('http://localhost:8082/authservice/api/auth/sign-in', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password }),
            });

            if (!response.ok) {
                const error = await response.json();

                if (error.error.includes("usernameError")) {
                    handleError('usernameError', error.message);
                }

                if (error.error.includes("credentials")) {
                    handleError('usernameError', error.message);
                    handleError('passwordError', error.message);
                } else {
                    throw new Error(error.message || 'Unknown error occurred');
                }
            } else {
                const text = await response.text();
                if (!text) {
                    return;
                }
                
                const credentials = JSON.parse(text)
                dispatch(setCredentials(credentials));
                navigate('/main');
            }
        } catch (error) {
            console.error('Error:', error.json());
        }
    };


    return (
        <div className="send-btn-wrapper">
            <Button sx={{ width: '100px', marginTop: '10px' }} variant="contained" onClick={handleSubmit} endIcon={<SendIcon />} size="small">
                Send
            </Button>
        </div>
    )
}

export default SignInSendBtn;