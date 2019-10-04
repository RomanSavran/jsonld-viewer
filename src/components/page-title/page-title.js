import React from 'react';
import PropTypes from 'prop-types';
import './page-title.scss';

const PageTitle = (props) => {
    return (
        <h2 className="page-title">{props.text}</h2>
    )
}

PageTitle.propTypes = {
    text: PropTypes.string.isRequired
}

export default React.memo(PageTitle);