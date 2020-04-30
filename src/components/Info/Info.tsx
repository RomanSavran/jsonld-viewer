import React from 'react';
import {
    makeStyles,
    createStyles,
    Theme,
    IconButton
} from '@material-ui/core';
import clsx from 'clsx';
import URI from '../URI';
import CopyTooltip from '../CopyTooltip';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

type InfoProps = {
    label: string,
    comment: string,
    id: string,
    superclasses: string[],
    isOnlyVocabulary: boolean,
    uri: string,
    type: 'class' | 'prop',
    uriList?: Array<{uri: string, title: string}>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        h2: {
            fontSize: 30,
            fontWeight: 600,
            lineHeight: '37px',
            textTransform: 'capitalize',
            [theme.breakpoints.down('md')]: {
                fontSize: 20
            }
        },
        h2Prop: {
            marginTop: 0
        },
        descriptionWrapper: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        descriptionItem: {
            width: '49%',
            marginRight: '2%',
            marginBottom: '2%',
            padding: '20px 15px',
            background: 'rgb(235, 240, 248)',
            boxSizing: 'border-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&:nth-child(2n)': {
                marginRight: 0
            },
            [theme.breakpoints.down('md')]: {
                width: '100%',
                marginRight: 0,
                marginBottom: 15,
                padding: 10,
            }
        },
        itemTitle: {
            margin: 0,
            marginRight: 10,
            marginBottom: 20,
            fontSize: 23,
            fontWeight: 600,
            lineHeight: '28px',
            [theme.breakpoints.down('md')]: {
                fontSize: 18
            }
        },
        ul: {
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: 0,
            listStyle: 'none',
        },
        ulLink: {
            fontSize: 14,
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline'
            }
        },
        link: {
            fontSize: 14,
            color: 'rgb(0, 149, 255)',
            [theme.breakpoints.down('md')]: {
                fontSize: 12
            }
        },
        li: {
            marginBottom: 5,
            padding: '2px 10px',
            fontSize: 14,
            background: 'rgb(196, 203, 216)',
            borderRadius: 3,
            color: 'rgb(49, 49, 49)'
        },
        text: {
            margin: 0,
            fontSize: 14,
            color: 'rgb(49, 49, 49)'
        },
        copyTitle: {
            marginBottom: 0
        },
        copyWrapper: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 20
        },
        iconButton: {
            padding: 2,
            color: 'rgb(33, 37, 41)',
            transition: '.2s linear',
            '&:hover': {
                color: 'rgb(0, 149, 255)'
            }
        },
        icon: {
            width: 18,
            height: 18,
        },
        arrowIcon: {
            marginBott: 5
        }
    })
);

const Info: React.FC<InfoProps> = ({
    id,
    label,
    comment,
    superclasses,
    isOnlyVocabulary,
    uri,
    type,
    uriList = null,
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div>
            <h2 className={clsx(classes.h2, {
                [classes.h2Prop]: type === 'prop'
            })}>{id}</h2>
            <div className={classes.descriptionWrapper}>
                {uriList ? (
                    <div className={classes.descriptionItem}>
                        <URI uri={uriList} />
                    </div>
                ) : (
                    !isOnlyVocabulary ? (
                        <div className={classes.descriptionItem}>
                            <div className={classes.copyWrapper}>
                                <h4
                                    className={clsx(classes.itemTitle, classes.copyTitle)}
                                >
                                    {type === 'class' ? t('Context URI') : t('Vocabulary URI')}
                                </h4>
                                <CopyTooltip
                                    copyText={uri}
                                    placement="right"
                                >
                                    <IconButton
                                        classes={{
                                            root: classes.iconButton
                                        }}
                                    >
                                        <FileCopyOutlinedIcon
                                            classes={{
                                                root: classes.icon
                                            }}
                                        />
                                    </IconButton>
                                </CopyTooltip>
                            </div>
                            <a
                                className={classes.link}
                                href={uri}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {uri}
                            </a>
                        </div>
                    ) : null
                )}
                <div className={classes.descriptionItem}>
                    <h4 className={classes.itemTitle}>{t("Label")}</h4>
                    <p className={classes.text}>{label}</p>
                </div>
                <div className={classes.descriptionItem}>
                    <h4 className={classes.itemTitle}>{t("Description")}</h4>
                    <p className={classes.text}>{comment}</p>
                </div>
                <div className={classes.descriptionItem}>
                    <h4 className={classes.itemTitle}>{type === 'prop' ? t("Property category") : t("Parent classes")} ({superclasses.length})</h4>
                    <ul className={classes.ul}>
                        {
                            superclasses
                                .map((item, index, array) => {
                                    const to: string = array.slice(0, index + 1).join('/');
                                    const mainPath = type === 'class' ? '/v1/Context/' : '/v1/Vocabulary/';
                                    const isContext: boolean = mainPath.split('/').includes('Context');

                                    return (
                                        <React.Fragment
                                            key={to}
                                        >
                                            <li
                                                className={classes.li}
                                            >
                                                <Link
                                                    className={classes.ulLink}
                                                    to={`${mainPath}${to}`.concat(isContext ? '/' : '')}
                                                >
                                                    {item}
                                                </Link>
                                            </li>
                                            {
                                                array.length - 1 !== index ? (
                                                    <li className={classes.arrowIcon}><ArrowDownwardIcon /></li>
                                                ) : null
                                            }
                                        </React.Fragment>
                                    )
                                })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default Info;