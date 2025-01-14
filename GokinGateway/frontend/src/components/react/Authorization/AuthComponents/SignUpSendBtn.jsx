import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setError, clearErrors } from "../../../redux/Input/action"; // добавьте экшн для очистки ошибок
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { setCredentials } from "../../../redux/Auth/Action";

const SendBtn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputValues = useSelector((state) => state.inputReducer.inputValues);

    const password = inputValues.password;
    const repeatedpassword = inputValues.repeatpassword;
    const email = inputValues.email;
    const username = inputValues.username;

    const handleError = (field, errorMsg) => {
        dispatch(setError(field, errorMsg));
    };

    const handleSubmit = async () => {
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const emailError = email === ''
                ? 'Поле email пустое.'
                : !emailRegex.test(email)
                    ? 'Неверный формат email.'
                    : '';
            const passwordError = password === ''
                ? 'Поле с паролем пустое.'
                : password.length < 4
                    ? 'Минимальный размер пароля 4 символа.'
                    : '';
            const usernameError = username === '' ? 'Заполните имя пользователя.' : '';
            const passwordsError = password !== repeatedpassword ? 'Пароли не совпадают.' : '';

            handleError('emailError', emailError);
            handleError('usernameError', usernameError);
            handleError('passwordError', passwordError);
            handleError('passwordsError', passwordsError);

            if (emailError || usernameError || passwordError || passwordsError) {
                return;
            }

            handleError('');
            const response = await fetch('http://localhost:8082/authservice/api/auth/sign-up', {
                method: 'POST',
                credentials: 'include',
                mode:"cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputValues),
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.error.includes("Username"))
                    handleError('usernameError', error.message);
                if (error.error.includes("Email"))
                    handleError('emailError', error.message);
            } else {
                const text = await response.text();
                if (!text) {
                    return;
                }
                
                const credentials = JSON.parse(text)
                dispatch(setCredentials(credentials));
                window.location.href = '/main';
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        return () => {
            handleError('emailError', '');
            handleError('usernameError', '');
            handleError('passwordError', '');
            handleError('passwordsError', '');
        };
    }, [navigate, dispatch]);

    return (
        <div className="send-btn-wrapper">
            <Button sx={{ width: '100px', marginTop: '10px' }} variant="contained" onClick={handleSubmit} endIcon={<SendIcon />} size="small">
                Send
            </Button>
        </div>
    );
};

export default SendBtn;
