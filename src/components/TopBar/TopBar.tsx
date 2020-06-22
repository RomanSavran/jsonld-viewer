import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Grid,
    makeStyles,
    useMediaQuery,
    useTheme,
    Theme,
    Collapse
} from '@material-ui/core';
import logo from '../../assets/logo-wide.png';
import Hamburger from '../Hamburger';
import LanguagePicker from '../LanuagePicker';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        padding: '15px 36px',
        background: '#1e1540',
        [theme.breakpoints.down('md')]: {
            padding: '5px 20px'
        }
    },
    logoWrapper: {
        padding: 5,
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'row-reverse'
        }
    },
    img: {
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        maxHeight: '100%',
        opacity: '0.7',
        [theme.breakpoints.down('md')]: {
            opacity: 1
        },
        [theme.breakpoints.down('sm')]: {
            maxHeight: 56
        }
    },
    ul: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        }
    },
    mobileNavigationWrapper: {
        padding: '0 0 15px',
        borderTop: '1px solid rgb(36, 71, 97)',
        borderBottom: '1px solid rgb(36, 71, 97)'
    },
    mobileNavigationTitle: {
        fontSize: 20,
        lineHeight: '24px',
        fontWeight: 600,
        color: '#fff'
    },
    link: {
        position: 'relative',
        display: 'block',
        padding: 5,
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '19px',
        color: '#fff',
        textDecoration: 'none',
        transition: '.1s linear',
        '&.active::before': {
            content: "''",
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 2,
            background: '#fff'
        },
        '&:hover': {
            color: '#7955ff'
        },
        [theme.breakpoints.down('md')]: {
            padding: '10px 5px'
        }
    },
    collapse: {
        width: '100%'
    },
    langLi: {
        width: 85,
        [theme.breakpoints.down('md')]: {
            paddingLeft: 5
        }
    }
}));

type Link = {
    label: string,
    to: string
}

const links: Link[] = [
    { label: 'Classes Hierarchy', to: '/v2/' },
    { label: 'Classes Grid', to: '/v2/classes-grid' },
    { label: 'Properties Grid', to: '/v2/properties-grid' },
    { label: 'Data Explainer', to: '/v2/data-explainer' }
]

const TopBar: React.FC = () => {
    const classes = useStyles();
    const theme: Theme = useTheme();
    const [isActive, setIsActive] = useState(false);
    const {t} = useTranslation();
    const isDesktop: boolean = !useMediaQuery(theme.breakpoints.down('md'));

    const handleToggleActive = () => {
        setIsActive(prevState => !prevState);
    }

    return (
        <div className={classes.header}>
            <Grid
                container
                spacing={isDesktop ? 3 : 1}
                alignItems="center"
                direction={isDesktop ? "row" : "row-reverse"}
            >
                <Grid
                    item
                    xs={5}
                >
                    <div className={classes.logoWrapper}>
                        <img
                            src={logo}
                            alt="Platform Of Trust"
                            className={classes.img}
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    xs={7}
                >
                    {isDesktop ? (
                        <ul className={classes.ul}>
                            {links.map(link => (
                                <li key={link.to}>
                                    <NavLink
                                        className={classes.link}
                                        to={link.to}
                                        exact
                                    >
                                        {t(link.label)}
                                    </NavLink>
                                </li>
                                
                            ))}
                            <li className={classes.langLi}>
                                <LanguagePicker />
                            </li>
                        </ul>
                    ) : (
                            <Hamburger
                                active={isActive}
                                toggleNavView={handleToggleActive} />
                        )
                    }
                </Grid>
                {!isDesktop ? (
                    <Collapse 
                        className={classes.collapse}
                        in={isActive}
                    >
                        <div className={classes.mobileNavigationWrapper}>
                            <h2 className={classes.mobileNavigationTitle}>{t("Main Navigation")}</h2>
                            <ul className={classes.ul}>
                                <li className={classes.langLi}>
                                    <LanguagePicker />
                                </li>
                                {links.map(link => (
                                    <li key={link.to}>
                                        <NavLink
                                            className={classes.link}
                                            
                                            to={link.to}
                                            exact
                                        >
                                            {t(link.label)}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Collapse>
                ) : null}
            </Grid>
        </div>
    )
}

export default React.memo(TopBar);