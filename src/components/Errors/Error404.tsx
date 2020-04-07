import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import {
    Typography,
    useTheme,
    useMediaQuery,
    Theme
} from '@material-ui/core';
import errorImage from '../../assets/404.svg';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 12,
            paddingTop: 24,
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center'
        },
        imageContainer: {
            marginTop: 48,
            display: 'flex',
            justifyContent: 'center'
        },
        image: {
            maxWidth: '100%',
            width: 560,
            maxHeight: 300,
            height: 'auto'
        },
        h1: {
            fontSize: 35,
            fontFamily: 'Montserrat'
        },
        h4: {
            fontSize: 25,
            fontFamily: 'Montserrat'
        },
        subtitle: {
            fontFamily: 'Montserrat'
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
    const theme: Theme = useTheme();
    const mobileDevice: boolean = useMediaQuery(theme.breakpoints.down('sm'));
    const {t} = useTranslation();

    return (
        <div
            className={classes.root}
            title="Error 404"
        >
            <Typography
                align="center"
                variant={mobileDevice ? 'h4' : 'h1'}
                classes={{
                    h1: classes.h1,
                    h4: classes.h4
                }}
            >
                404: {t("Ooops, something went terribly wrong!")}
            </Typography>
            <Typography
                align="center"
                variant="subtitle2"
                classes={{
                    subtitle2: classes.subtitle
                }}
            >
                {t("You either tried some shady route or you came here by mistake.")} 
                {t("Whichever it is, try using the navigation")}
            </Typography>
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
