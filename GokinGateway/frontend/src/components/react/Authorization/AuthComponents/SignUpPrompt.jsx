import React from "react";
import '../../../../static/Auth/signUpPrompt.css'
import { Link } from "react-router-dom";
const SignUpPrompt = ()=>{
    return(
        <div className="sign-up-prompt">
            <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
        </div>
    )
}
export default SignUpPrompt;