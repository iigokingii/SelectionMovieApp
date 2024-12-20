import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {setError } from '../../../redux/Input/action'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { setCredentials } from "../../../redux/Auth/Action";
import { pad } from "lodash";

const SignInSendBtn = () =>{
    const navigate = useNavigate();
    const inputValues = useSelector((state) => state.inputReducer.inputValues);
    

    const email = inputValues.email;
    const password = inputValues.password;
    const dispatch = useDispatch();
    const handleError=(field,errorMsg)=>{
        dispatch(setError(field,errorMsg));
    }

    const handleSubmit = async () => {
        try {
            const emailError = email === '' ? 'Email field is empty.' : '';
            const passwordError = password===''?'Password is empty.':'';

            handleError('emailError', emailError);
            handleError('passwordError', passwordError);

            if (emailError || passwordError) {
                return; 
            }

            const response = await fetch('http://localhost:8082/authservice/api/auth/sign-in', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password: password }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.log(error);
                if(error.error.includes("emailError"))
                    handleError('emailError',error.message);
                if(error.error.includes("credentials")){
                    handleError('emailError',error.message);
                    handleError('passwordError',error.message);
                }
                else
                    throw new Error(error.message || 'Unknown error occurred');
            }
            else{
                const credentials = await response.json();
                dispatch(setCredentials(credentials))
                console.log('Success:', credentials);
                navigate('/main');
            }
        }   
        catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <div className="send-btn-wrapper">
            <Button sx={{width:'100px', marginTop:'10px'}} variant="contained" onClick={handleSubmit} endIcon={<SendIcon/>} size="small">
                Send
            </Button>
        </div>
    )
}

export default SignInSendBtn;