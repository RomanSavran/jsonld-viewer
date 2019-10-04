import React from 'react';
import PropTypes from 'prop-types';
import './navigation.scss';

const Navigation = (props) => {
    return (
        <ul className="navbar-header">
            {
                React.Children.map(props.children, child => {
                    return (
                        <li>
                            {child}
                        </li>
                    )
                })
            }
        </ul>
    )
}

Navigation.propTypes = {
    children: PropTypes.array
}

Navigation.defaultProps = {
    additionalClass: ''
}

export default Navigation;