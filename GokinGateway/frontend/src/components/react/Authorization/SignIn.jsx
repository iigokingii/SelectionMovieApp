import React from "react";
import SignInSendBtn from "./AuthComponents/SignInSendBtn";
import InputField from "./AuthComponents/InputField";
import PasswordField from "./AuthComponents/PasswordField";
import '../../../static/Auth/auth.css'
import SignInPrompt from "./AuthComponents/SignInPrompt";

const SignIn = ({})=>{
    return (
        <div className="form-wrapper"> 
            <form className="sign-up-form">
                <InputField field = "Email"></InputField>
                <PasswordField field="Password" marginBtm='20px'></PasswordField>
                <SignInPrompt></SignInPrompt>
                <SignInSendBtn></SignInSendBtn>
            </form>
        </div>
)}

export default SignIn;
