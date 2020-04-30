import React from 'react';
import {
    makeStyles,
    createStyles,
    IconButton,
} from '@material-ui/core';
import CopyTooltip from '../CopyTooltip';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import clsx from 'clsx';

type URIProps = {
    uri: Array<{ uri: string, title: string }>
}

const useStyles = makeStyles((theme) => 
    createStyles({
        itemDescription: {
            marginTop: 30,
			marginBottom: 30,
			padding: '20px 15px',
			background: 'rgb(235, 240, 248)',
			overflow: 'hidden',
			textOverflow: 'ellipsis'
        },
        itemDescrQ: {
            margin: 0,
            padding: 0
        },
        copyWrapper: {
			display: 'flex',
			alignItems: 'center',
			marginBottom: 20
        },
        copyTitle: {
			margin: 0,
			marginRight: 10,
			fontSize: 23,
			fontWeight: 600,
			lineHeight: '28px',
			marginBottom: 0
		},
		link: {
			fontSize: 14,
			color: 'rgb(0, 149, 255)'
        },
        iconButtonCopy: {
			padding: 2,
			color: 'rgb(33, 37, 41)',
			transition: '.2s linear',
			'&:hover': {
				color: 'rgb(0, 149, 255)'
			}
		},
		iconCopy: {
			width: 18,
			height: 18,
        },
        uriItem: {
            marginBottom: 25,
            '&:last-child': {
                marginBottom: 0
            }
        },
        itemTitleQ: {
            fontSize: 20,
            fontWeight: 500,
            [theme.breakpoints.down('sm')]: {
                fontSize: 12
            }
        }
    })
);

const URI: React.FC<URIProps> = ({
    uri
}) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.itemDescription, {
            [classes.itemDescrQ]: uri.length > 1
        })}>
            {uri.map(item => {
                return (
                    <div key={item.uri} className={classes.uriItem}>
                        <div className={classes.copyWrapper}>
                        <h4 className={clsx(classes.copyTitle, {
                            [classes.itemTitleQ]: uri.length > 1
                        })}>{item.title}</h4>
                            <CopyTooltip
                                copyText={item.uri}
                                placement="right"
                            >
                                <IconButton
                                    classes={{
                                        root: classes.iconButtonCopy
                                    }}
                                >
                                    <FileCopyOutlinedIcon
                                        classes={{
                                            root: classes.iconCopy
                                        }}
                                    />
                                </IconButton>
                            </CopyTooltip>
                        </div>
                        <a
                            className={classes.link}
                            href={item.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.uri}
                        </a>
                    </div>
                )
            })}
        </div>
    )
}

export default URI;