import React from 'react';
import logo from '../../images/logo.svg';
import './logo.scss';

const Logo = () => {
    return (
        <div className="logo-block">
            <img src={logo} alt="Platform Of Trust"/>
        </div>
    )
}

export default Logo;