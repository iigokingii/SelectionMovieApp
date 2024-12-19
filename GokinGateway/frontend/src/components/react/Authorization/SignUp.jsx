import React from "react";
import InputField from "./AuthComponents/InputField";
import SignUpSendBtn from "./AuthComponents/SignUpSendBtn";
import PasswordField from "./AuthComponents/PasswordField";
import '../../../static/Auth/auth.css'
import SignUpPrompt from "./AuthComponents/SignUpPrompt";
const SignUp = ()=>{
    return (
        <div className="form-wrapper">
            <form className="sign-up-form">
                <InputField field = "Username"></InputField>
                <InputField field = "Email"></InputField>
                <PasswordField field="Password" marginBtm='20px'></PasswordField>
                <PasswordField field="Repeat password" marginBtm='20px'></PasswordField>
                <SignUpPrompt></SignUpPrompt>
                <SignUpSendBtn></SignUpSendBtn>
            </form>
        </div>
    )}

export default SignUp;
