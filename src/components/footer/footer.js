import React from 'react';
import './footer.scss';

const Footer = () => {
    return (
        <div className="platform-footer">
            <div className="row">
                <div className="col-sm-6 col-12 text-center text-sm-left">
                    {new Date().getFullYear()} &#169; All rights reserved
                </div>
                <div className="col-sm-6 col-12 text-sm-right text-center">
                    <a href="/">Privacy Policy</a> |
                    {" "}
                    <a href="/">Terms & Conditions</a>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Footer);