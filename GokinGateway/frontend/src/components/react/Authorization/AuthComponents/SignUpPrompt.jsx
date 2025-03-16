import React from "react";
import '../../../../static/Auth/signUpPrompt.css'
import { Link } from "react-router-dom";
const SignUpPrompt = ()=>{
    return(
        <div className="sign-up-prompt">
            <p>Уже есть аккаунт? <Link to="/sign-in">Авторизация</Link></p>
        </div>
    )
}
export default SignUpPrompt;