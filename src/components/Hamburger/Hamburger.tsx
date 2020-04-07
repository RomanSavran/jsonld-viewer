import React from 'react';
import './index.css';

type HamburgerTypes = {
    active: boolean,
    toggleNavView: () => void
}

const Hamburger: React.FC<HamburgerTypes> = ({ active, toggleNavView }) => {
    const classes = !active ? 'hamburger hamburger--arrow js-hamburger' : 'hamburger hamburger--arrow js-hamburger is-active';

    return (
        <div className={classes} onClick={toggleNavView}>
            <div className="hamburger-box">
                <div className="hamburger-inner">
                    <span className="hamburger-support"></span>
                </div>
            </div>
        </div>
    )
}

export default Hamburger