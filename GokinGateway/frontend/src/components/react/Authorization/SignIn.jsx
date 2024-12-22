import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import SignInSendBtn from "./AuthComponents/SignInSendBtn";
import InputField from "./AuthComponents/InputField";
import PasswordField from "./AuthComponents/PasswordField";
import '../../../static/Auth/auth.css'
import SignInPrompt from "./AuthComponents/SignInPrompt";
import { restoreInputValue } from "../../redux/Input/action";

const SignIn = ({})=>{

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(restoreInputValue());
        };
    }, [dispatch]);

    return (
        <div className="form-wrapper"> 
            <form className="sign-up-form">
                <InputField field = "Username"></InputField>
                <PasswordField field="Password" marginBtm='20px'></PasswordField>
                <SignInPrompt></SignInPrompt>
                <SignInSendBtn></SignInSendBtn>
            </form>
        </div>
)}

export default SignIn;
