import React, { useState } from 'react';
import download from 'downloadjs';
import {
    Collapse,
    makeStyles,
    createStyles,
    IconButton,
    Theme
} from '@material-ui/core';
import clsx from 'clsx';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import sizeof from 'object-sizeof';
import { useTranslation } from 'react-i18next';
import CopyTooltip from '../CopyTooltip';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: 20
        },
        chevronWrapper: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        chevron: {
            fontSize: '2.3rem',
            color: '#000',
            transition: '.2s linear'
        },
        chevronOpen: {
            transform: 'rotate(180deg)',
            transition: '.2s linear'
        },
        definitionTop: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '13px 23px',
            background: 'rgb(21, 72, 109)',
            [theme.breakpoints.down('md')]: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 10
            }
        },
        definitionTopColumn: {
            flexDirection: 'column',
        },
        definitionTopLeft: {
            fontSize: 14,
            color: '#fff',
            [theme.breakpoints.down('md')]: {
                marginBottom: 15
            }
        },
        definitionTopLeftColumn: {
            marginBottom: 15
        },
        definitionTopRight: {
            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            }
        },
        pre: {
            margin: 0,
            padding: 20,
            fontSize: 14,
            fontFamily: 'Roboto',
            fontWeight: 300,
            overflow: 'hidden',
            overflowX: 'auto',
            overflowY: 'auto',
            color: 'rgb(12, 77, 123)',
            [theme.breakpoints.down('md')]: {
                padding: 10,
                maxHeight: 500
            }
        },
        body: {
            marginBottom: 20,
            background: 'linear-gradient(0deg,rgb(235, 240, 248),rgb(235, 240, 248)),rgb(29, 37, 72)'
        },
        h3: {
            margin: 0,
            marginBottom: 10,
            fontSize: 23,
            fontWeight: 600,
            lineHeight: '28px'
        },
        iconButton: {
            padding: 2
        },
        downloadBtn: {
            padding: '4px 9px',
            fontSize: 14,
            background: 'rgb(31, 91, 134)',
            color: 'rgb(255, 255, 255)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: '.2s linear',
            '&:hover': {
                background: 'rgb(32, 178, 170)'
            }
        },
        downloadBtnLink: {
            marginRight: 20,
            textDecoration: 'none',
            [theme.breakpoints.down('md')]: {
                marginRight: 0,
                marginBottom: 10
            }
        },
        copyBtn: {
            marginRight: 20,
            [theme.breakpoints.down('md')]: {
                marginRight: 0,
                marginBottom: 10
            }
        }
    })
);

type CopyBtnType = {
    classes: string,
}

const CopyBtn: React.FC<CopyBtnType> = ({ classes, children, ...rest }) => {
    return <span {...rest} className={classes}>{children}</span>
}

type ContentViewerTypes = {
    content: any,
    fileName: string,
    playground: boolean,
    title?: string,
    subclasses?: boolean
}

const ContentViewer: React.FC<ContentViewerTypes> = ({
    content,
    playground,
    fileName,
    title = 'Implementation',
    subclasses = false
}) => {
    const classes = useStyles();
    const [showDetails, setShowDetails] = useState(true);
    const { t } = useTranslation();

    const handleChangeShowDetails = () => {
        setShowDetails(prevState => !prevState);
    }

    const downloadFile = () => {
        const downloadData = JSON.stringify(content, undefined, 2);

        download(downloadData, fileName, 'application/json');
    };

    const sloc = JSON
        .stringify(content, undefined, 2)
        .split('\n')
        .length;
    const size = (sizeof(content) / 1000).toFixed(2);
    const playgroundURL: string = `https://json-ld.org/playground/#startTab=tab-expanded&json-ld=${encodeURIComponent(JSON.stringify(content))}`

    return (
        <div className={classes.root}>
            <div className={classes.chevronWrapper}>
                <h3 className={classes.h3}>{t(title)}</h3>
                <IconButton
                    className={classes.iconButton}
                    onClick={handleChangeShowDetails}
                >
                    <KeyboardArrowDownIcon className={clsx(classes.chevron, {
                        [classes.chevronOpen]: !showDetails
                    })} />
                </IconButton>
            </div>
            <div className={classes.body}>
                <div className={clsx(classes.definitionTop, {
                    [classes.definitionTopColumn]: !!subclasses
                })}>
                    <div className={clsx(classes.definitionTopLeft, {
                        [classes.definitionTopLeftColumn]: !!subclasses
                    })}>
                        <span>{sloc} {t('lines')} ({sloc} sloc)</span>
                        {" "}
                        <span>{`${size} KB`}</span>
                    </div>
                    <div className={classes.definitionTopRight}>
                        {playground ? (
                            <a
                                className={clsx(classes.downloadBtn, classes.downloadBtnLink)}
                                href={playgroundURL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('Open in JSON-LD Playground')}
                            </a>
                        ) : null}
                        <CopyTooltip
                            placement="top"
                            copyText={JSON.stringify(content, undefined, '\t')}
                        >
                            <CopyBtn classes={clsx(classes.downloadBtn, classes.copyBtn)}>{t('Copy')}</CopyBtn>
                        </CopyTooltip>
                        <span
                            className={classes.downloadBtn}
                            onClick={downloadFile}
                        >
                            {t('Download')}
                        </span>
                    </div>
                </div>
                <Collapse
                    in={showDetails}
                    timeout={350}
                >
                    <pre className={classes.pre}>{JSON.stringify(content, undefined, '\t')}</pre>
                </Collapse>
            </div>
        </div>
    )
}

export default ContentViewer;