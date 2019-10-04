import React from 'react';
import {withGlobalState} from '../hoc-helpers';
import { NavLink } from 'react-router-dom';
import Hamburger from '../hamburger';
import Navigation from '../navigation';
import Logo from '../logo';
import Collapse from '@material-ui/core/Collapse';
import './header.scss';

const Header = (props) => {

    const {value: {showMobileNav, toggleNavView, width}} = props;

    return (
        <>
            <div className="platform-header">
                <div className="row d-flex align-items-center justify-content-between top">
                    <div className="col-sm-3 col-md-3 col-6">
                        <Logo />
                    </div>
                    <div className="col-sm-5 col-md-5 col-6 text-left">
                        {
                            width > 992 ? (
                                <Navigation>
                                    <NavLink to="/v1/classes-higherarchy" activeClassName="active">Classes higherarchy</NavLink>
                                    <NavLink to="/v1/classes-grid" activeClassName="active">Classes grid</NavLink>
                                    <NavLink to="/v1/properties-grid" activeClassName="active">Properties</NavLink>
                                </Navigation>
                            ) : <Hamburger active={showMobileNav} toggleNavView={toggleNavView}/>
                        }
                    </div>
                </div>
                {
                    width <= 992 ? (
                        <div className="mobile-navigation">
                            <Collapse in={showMobileNav}>
                                <div className="bottom">
                                    <h2 className="mobile-nav-title">Main navigation</h2>
                                    <Navigation>
                                        <NavLink to="/v1/classes-higherarchy" activeClassName="active">Classes higherarchy</NavLink>
                                        <NavLink to="/v1/classes-grid" activeClassName="active">Classes grid</NavLink>
                                        <NavLink to="/v1/properties-grid" activeClassName="active">Properties</NavLink>
                                    </Navigation>
                                </div>
                            </Collapse>
                        </div>
                    ) : null
                }
            </div>
            
        </>
    )
}

export default React.memo(withGlobalState(Header));