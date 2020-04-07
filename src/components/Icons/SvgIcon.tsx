import React from 'react';
import MuiSvgIcon from '@material-ui/core/SvgIcon';
import {SvgIconProps} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        width: 'auto',
        height: 'auto'
    }
}))

const SvgIcon: React.FC<SvgIconProps> = (props) => {
    const classes = useStyles();
    
    return (
        <MuiSvgIcon classes={{root: classes.root}} {...props}>
            {React.Children.map(props.children, child => child)}
        </MuiSvgIcon>
    )
}

export default SvgIcon;