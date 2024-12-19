import React from "react";
import '../../../../static/Auth/signUpPrompt.css'
import { Link } from "react-router-dom";
const SignInPrompt = ()=>{
    return(
        <div className="sign-up-prompt">
            <p>Don't have account? <Link to="/sign-up">Sign Up</Link></p>
        </div>
    )
}
export default SignInPrompt;