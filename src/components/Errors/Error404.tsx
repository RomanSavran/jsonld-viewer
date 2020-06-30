import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core';
import {
    Theme
} from '@material-ui/core';
import errorImage from '../../assets/404.png';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 12,
            paddingTop: 24,
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-around',
            [theme.breakpoints.down('md')]: {
                flexDirection: 'column'
            }
        },
        imageContainer: {
            marginTop: 48,
            display: 'flex',
            justifyContent: 'center'
        },
        textRoot: {
            [theme.breakpoints.down('md')]: {
                textAlign: 'center'
            }
        },
        image: {
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            [theme.breakpoints.down('sm')]: {
                maxWidth: '50%'
            },
            [theme.breakpoints.down('xs')]: {
                maxWidth: '100%'
            }
        },
        h1: {
            margin: 0,
            fontSize: 65,
            fontFamily: 'Lato',
            color: '#fff',
            [theme.breakpoints.down('md')]: {
                fontSize: 35
            }
        },
        h4: {
            fontSize: 25,
            fontFamily: 'Lato',
            color: '#fff',
            [theme.breakpoints.down('md')]: {
                fontSize: 18
            }
        },
        subtitle: {
            fontFamily: 'Lato',
            fontSize: 18,
            color: '#fff'
        },
        buttonContainer: {
            marginTop: 48,
            display: 'flex',
            justifyContent: 'center'
        }
    })
);

function Error404() {
    const classes = useStyles();

    return (
        <div
            className={classes.root}
            title="Error 404"
        >
            <div className={classes.textRoot}>
                <p className={classes.h1}>Oh 4-0-No!</p>
                <p className={classes.h4}>The page you were looking for is not here.</p>
            </div>
            <div className={classes.imageContainer}>
                <img
                    alt="Under development"
                    className={classes.image}
                    src={errorImage}
                />
            </div>
        </div>
    );
}

export default Error404;
