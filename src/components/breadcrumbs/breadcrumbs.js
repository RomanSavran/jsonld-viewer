import React from 'react';
import {Link} from 'react-router-dom';
import {getFromStorage, capitalizeFirstLetter} from '../../services/utils';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PropTypes from 'prop-types';
import {withGlobalState} from '../hoc-helpers';

const RouterBreadcrumbs = (props) => {
    const prevURL = props.value.prevURL || getFromStorage('prevURL') || 'classes-higherarchy';
    const newItems = props.items.filter(el => el.toLowerCase() !== 'v1' && 
                                        el.toLowerCase() !== 'classes-higherarchy' && 
                                        el.toLowerCase() !== 'classes-grid' && 
                                        el.toLowerCase() !== 'properties-grid');
    const rootLabel = prevURL ? prevURL.split('-').map(str => capitalizeFirstLetter(str)).join(' ') : 'Classes Higherarchy';

    return (
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small"/>}>
            {
                !newItems.length ? (
                    <Typography color="textPrimary">
                        {rootLabel}
                    </Typography>
                ) : (
                    <Link to={`/v1/${prevURL}`}>
                        {rootLabel}
                    </Link>
                )
            }
            {
                newItems.map((value, index, array) => {
                    const last = index === newItems.length - 1;

                    let to = `/v1/${newItems.slice(0, index + 1).filter(el => el.toLowerCase() !== 'v1').join('/')}`;
                    const label = value.includes('-') ? value.split('-').map(str => capitalizeFirstLetter(str)).join(' ') : capitalizeFirstLetter(newItems[index]);

                    if (value.toLowerCase() === 'context') {
                        to += '/';
                        return null;
                    }

                    if (value.toLowerCase() === 'identity' || 
                        value.toLowerCase() === 'link' || 
                        value.toLowerCase() === 'classes-higherarchy' || 
                        value.toLowerCase() === 'classes-grid' ||
                        value.toLowerCase() === 'properties-grid') {
                        return null
                    }
                    
                    return last ? (
                        <Typography color="textPrimary" key={to}>
                            {label}
                        </Typography>
                    ) : (
                        <Link to={to} key={to}>
                            {label}
                        </Link>
                    )
                })
            }
        </Breadcrumbs>
    )
}

RouterBreadcrumbs.propTypes = {
    items: PropTypes.array
}

export default withGlobalState(RouterBreadcrumbs);