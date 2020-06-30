import React, {useContext} from 'react';
import { RoutesContext } from '../../context/RoutesContext';
import {
    Breadcrumbs as MuiBreadcrumbs,
    makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    breadcrumbs: {
        padding: '8px 20px',
        fontSize: 16,
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
        textTransform: 'capitalize',
        background: 'rgba(30, 21, 64, .5)',
    },
    link: {
        fontSize: 'inherit',
        color: '#fff',
        textDecoration: 'none',
    },
    typography: {
        margin: 0,
        padding: 0,
        fontSize: 'inherit',
        color: 'rgb(194,178,255)'
    },
    ol: {
        '& li:nth-last-child(2) svg': {
            fill: 'rgb(255, 255, 255)'
        }
    },
    separator: {
        '& svg': {
            fill: '#fff'
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
                'v2', 
                'context',
                'vocabulary',
                'classdefinitions',
                '', 
                'classes-hierarchy', 
                'classes-grid', 
                'properties-grid',
                'schema',
                'dataexample',
                'data-explainer'
            ].includes(path.toLowerCase());
        });
    const gluedPath = location.pathname
        .replace(/Schema|ClassDefinitions|DataExample/gi, 'Context')
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
                let to = path === 'classes-hierarchy' ? `/v2/` : 
                    ['classes-grid', 'properties-grid', 'data-explainer'].includes(path) ? `/v2/${path}` : 
                    /Vocabulary/.test(fullPath) ? fullPath : `${fullPath}/`;
                const label: string = t(path.split('-').join(' '));

                return last ? (
                    <p
                        className={classes.typography}
                        key={to}
                    >
                        {label}
                    </p>
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