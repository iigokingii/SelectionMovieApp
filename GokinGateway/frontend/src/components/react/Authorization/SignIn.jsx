import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import SignInSendBtn from "./AuthComponents/SignInSendBtn";
import InputField from "./AuthComponents/InputField";
import PasswordField from "./AuthComponents/PasswordField";
import "../../../static/Auth/auth.css";
import SignInPrompt from "./AuthComponents/SignInPrompt";
import { restoreInputValue } from "../../redux/Input/action";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const SignIn = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(restoreInputValue());
        };
    }, [dispatch]);

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8082/authservice/oauth2/authorization/google";
    };

    return (
        <div className="form-wrapper">
            <form className="sign-up-form2">
                <InputField field="Username" label="Логин" />
                <PasswordField field="Password" label="Пароль" marginBtm="20px" />
                <SignInPrompt />

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

                <SignInSendBtn />
            </form>
        </div>
    );
};

export default SignIn;
