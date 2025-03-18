import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import InputField from "./AuthComponents/InputField";
import SignUpSendBtn from "./AuthComponents/SignUpSendBtn";
import PasswordField from "./AuthComponents/PasswordField";
import "../../../static/Auth/auth.css";
import SignUpPrompt from "./AuthComponents/SignUpPrompt";
import { restoreInputValue } from "../../redux/Input/action";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const SignUp = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(restoreInputValue());
        };
    }, [dispatch]);

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8083/oauth2/authorization/google";
    };

    return (
        <div className="form-wrapper">
            <form className="sign-up-form">
                <InputField field="Username" label="Логин" />
                <InputField field="Email" label="Email" />
                <PasswordField field="Password" label="Пароль" marginBtm="20px" />
                <PasswordField field="Repeat password" label="Повторите пароль" marginBtm="20px" />
                <SignUpPrompt />

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GoogleIcon />}
                    fullWidth
                    sx={{ mt: 2, backgroundColor: "#DB4437", color: "white", "&:hover": { backgroundColor: "#c1351d" } }}
                    onClick={handleGoogleLogin}
                >
                    Войти через Google
                </Button>

                <SignUpSendBtn />
            </form>
        </div>
    );
};

export default SignUp;
