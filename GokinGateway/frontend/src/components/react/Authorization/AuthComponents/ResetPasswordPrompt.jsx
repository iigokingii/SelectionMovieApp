import React from "react";
import '../../../../static/Auth/signUpPrompt.css'
import { Link } from "react-router-dom";
const ResetPasswordPrompt = ()=>{
    return(
        <div className="sign-up-prompt" style={{marginTop:"10px"}}>
            <p>Забыл пароль? <Link to="/forget-password">Сброс</Link></p>
        </div>
    )
}
export default ResetPasswordPrompt;