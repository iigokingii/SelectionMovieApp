import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {setError } from '../../../redux/Input/action'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { setCredentials } from "../../../redux/Auth/Action";

const SendBtn = () => {
    const navigate = useNavigate();
    const inputValues = useSelector((state) => state.inputReducer.inputValues);

    const password = inputValues.password;
    const repeatedpassword = inputValues.repeatpassword;
    const email = inputValues.email;
    const username = inputValues.username;
    const dispatch = useDispatch();
    const handleError=(field,errorMsg)=>{
        dispatch(setError(field,errorMsg));
    }

    const handleSubmit = async () => {
        try {
            const emailError = email === '' ? 'Email field is empty.' : '';
            const usernameError = username === '' ? 'Username is empty.' : '';
            const passwordError = password===''?'Password is empty.':'';
            const passwordsError = password !== repeatedpassword ? 'The passwords are not the same.' : '';

            handleError('emailError', emailError);
            handleError('usernameError', usernameError);
            handleError('passwordError', passwordError);
            handleError('passwordsError', passwordsError);

            if (emailError || usernameError || passwordError || passwordsError) {
                return; 
            }
            console.log(inputValues);
            handleError('');
            const response = await fetch('http://localhost:8082/authservice/api/auth/sign-up', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputValues),
            });

            if (!response.ok) {
                const error = await response.json();
                console.log(error);
                if(error.error.includes("Username"))
                    handleError('usernameError', error.message);
                if(error.error.includes("Email"))
                    handleError('emailError', error.message);
            }
            else{
                const credentials = await response.json();
                console.log(credentials);
                dispatch(setCredentials(credentials))
                console.log('Success:', credentials);
                navigate('/main');
            }
        }   
        catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="send-btn-wrapper">
            <Button sx={{width:'100px', marginTop:'10px'}} variant="contained" onClick={handleSubmit} endIcon={<SendIcon/>} size="small">
                Send
            </Button>
        </div>
    );
};

export default SendBtn;