import React from "react";
import '../../../../static/Auth/signUpPrompt.css'
import { Link } from "react-router-dom";
const SignInPrompt = ()=>{
    return(
        <div className="sign-up-prompt">
            <p>Нет аккаунта? <Link to="/sign-up">Регистрация</Link></p>
        </div>
    )
}
export default SignInPrompt;