import React from 'react';
import {
    makeStyles,
    createStyles
} from '@material-ui/core';
import logo from '../../assets/logo-wide.png';

const useStyles = makeStyles(() => 
    createStyles({
        "@keyframes animGlow": {
            "0%": {
                transform: 'scale(0.9)',
            },
            "50%": {
                transform: 'scale(1)'
            },
            "100%": {
                transform: 'scale(0.9)',
            }
        },
        root: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        image: {
            animation: '$animGlow 1.5s ease infinite'
        }
    })
);

const InitiLoader: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <img 
                className={classes.image}
                alt="Platform Of Trust"
                src={logo}
            />
        </div>
    )
}

export default InitiLoader;