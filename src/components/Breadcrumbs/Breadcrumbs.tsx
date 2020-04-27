import React, {useContext} from 'react';
import { RoutesContext } from '../../context/RoutesContext';
import {
    Breadcrumbs as MuiBreadcrumbs,
    Typography,
    makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    breadcrumbs: {
        padding: '8px 20px',
        fontSize: 16,
        textTransform: 'capitalize',
        background: 'rgb(21, 72, 109)',
    },
    link: {
        fontSize: 'inherit',
        color: 'rgb(145, 157, 182)',
        textDecoration: 'none',
    },
    typography: {
        color: 'rgb(255, 255, 255)'
    },
    ol: {
        '& li:nth-last-child(2) svg': {
            fill: 'rgb(255, 255, 255)'
        }
    },
    separator: {
        '& svg': {
            fill: 'rgb(145, 157, 182)'
        }
    }
}));

const Breadcrumbs: React.FC = () => {
    const {
        currentPath
    } = useContext(RoutesContext);
    const classes = useStyles();
    const location = useLocation();
    const {t} = useTranslation();
    const urlArray: string[] = location.pathname
        .split('/')
        .filter(path => {
            return ![
                'v1', 
                'context',
                'vocabulary',
                'classdefinitions',
                '', 
                'classes-hierarchy', 
                'classes-grid', 
                'properties-grid',
                'schema'
            ].includes(path.toLowerCase());
        });
    const gluedPath = location.pathname
        .split('/')
        .filter((s: string) => !!s);

    return (
        <MuiBreadcrumbs
            className={classes.breadcrumbs}
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small"/>}
            classes={{ol: classes.ol, separator: classes.separator}}
        >
            {[currentPath, ...urlArray].map((path, index, array) => {
                const last = index === array.length - 1;
                const pathIndex = gluedPath
                    .findIndex(s => s === path);
                const fullPath = gluedPath
                    .reduce((acc, current, idx) => {
                        return idx > pathIndex ? acc : acc + '/' + current;
                    }, '');
                let to = path === 'classes-hierarchy' ? `/v1/` : 
                    ['classes-hierarchy', 'classes-grid', 'properties-grid'].includes(path) ? `/${path}` : 
                        location.pathname.includes('Vocabulary') ? fullPath : fullPath + '/';
                const label: string = t(path.split('-').join(' '));

                return last ? (
                    <Typography
                        className={classes.typography}
                        color="textPrimary"
                        key={to}
                    >
                        {label}
                    </Typography>
                ) :  (
                    <Link 
                        to={to} 
                        key={to}
                        className={classes.link}
                    >
                        {label}
                    </Link>
                )
            })}
        </MuiBreadcrumbs>
    )
};

export default Breadcrumbs;