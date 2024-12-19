import React from "react";
import { Link } from 'react-router-dom';
import '../../../../static/Header/headerLinkBlock.css';

const LinkBlock=({link, title})=>{
    return(
        <div className="link-wrapper">
            <Link to={link}>{title}</Link>
        </div>
    )
}

export default LinkBlock;