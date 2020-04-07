import React, { useState } from 'react';
import {
	Collapse,
	makeStyles,
	createStyles,
	IconButton,
	Theme
} from '@material-ui/core';
import clsx from 'clsx';
import CopyTooltip from '../../CopyTooltip';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import download from 'downloadjs';
import Markdown from 'react-markdown';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => 
	createStyles({
		root: {
			marginTop: 30,
		},
		itemDescription: {
			marginBottom: 30,
			padding: '20px 15px',
			background: 'rgb(235, 240, 248)',
			overflow: 'hidden',
			textOverflow: 'ellipsis'
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
		iconButton: {
			padding: 2
		},
		h3: {
			margin: 0,
			marginBottom: 10,
			fontSize: 23,
			fontWeight: 600,
			lineHeight: '28px'
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
			background: 'rgb(21, 72, 109)'
		},
		definitionTopLeft: {
			fontSize: 14,
			color: '#fff'
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
		markdown: {
			padding: 20,
			border: '2px solid rgb(235, 240, 248)',
			'& ul': {
				marginTop: 0,
				marginBottom: '1rem',
				[theme.breakpoints.down('md')]: {
					paddingLeft: 20,
				}
			},
			'& li': {
				[theme.breakpoints.down('md')]: {
					fontSize: 14
				}
			},
			'& p': {
				marginTop: 0,
				marginBottom: '1rem',
				[theme.breakpoints.down('md')]: {
					fontSize: 14
				}
			},
			'& h1': {
				marginTop: 0,
				[theme.breakpoints.down('md')]: {
					fontSize: 25
				}
			},
			'& h2': {
				marginTop: 0,
				fontSize: '2rem',
				marginBottom: '.5rem',
				fontWeight: 500,
				lineHeight: '1.2',
				[theme.breakpoints.down('md')]: {
					fontSize: 22
				}
			},
			'& code': {
				fontSize: 16,
				color: 'rgb(232, 62, 140)',
				wordBreak: 'break-word',
				[theme.breakpoints.down('md')]: {
					fontSize: 14
				}
			},
			'& a': {
				color: 'rgb(0, 123, 255)',
				textDecoration: 'none',
				'&:hover': {
					textDecoration: 'underline'
				}
			},
			'& pre': {
				display: 'block',
				marginTop: 0,
				marginBottom: '1rem',
				overflow: 'auto',
				padding: 10,
				fontFamily: 'Roboto',
				fontSize: 14,
				fontWeight: 300,
				background: 'rgb(235, 240, 248)',
				'& code': {
					fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
					color: 'rgb(0, 0, 139)'
				}
			},
			'& strong': {
				fontWeight: 600
			},
			[theme.breakpoints.down('md')]: {
				overflow: 'hidden',
				overflowX: 'scroll',
			}
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
		copyBtn: {
			marginRight: 10
		}
	})
);

type CopyBtnType = {
	classes: string,
}

const CopyBtn: React.FC<CopyBtnType> = ({classes, children, ...rest}) => {
	return <span {...rest} className={classes}>{children}</span>
}

type MainTabProps = {
	uri: string,
	sloc: number,
	size: string,
	content: any,
	fileName: string,
	markdown: any,
}

const MainTab: React.FC<MainTabProps> = (props) => {
	const classes = useStyles();
	const {
		uri,
		sloc,
		size,
		content,
		fileName,
		markdown
	} = props;
	const {t} = useTranslation();
	const [showDetails, setShowDetails] = useState(true);

	const handleChangeShowDetails = () => {
		setShowDetails(prevState => !prevState);
	}

	const downloadFile = () => {
		const downloadData = JSON.stringify(content, undefined, 2);

		download(downloadData, `${fileName}.json`, 'application/json');
	}

	return (
		<div className={classes.root}>
			<div className={classes.itemDescription}>
				<div className={classes.copyWrapper}>
					<h4 className={classes.copyTitle}>URI</h4>
					<CopyTooltip
						copyText={uri}
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
					href={uri}
					target="_blank"
					rel="noopener noreferrer"
				>
					{uri}
				</a>
			</div>
			<div className={classes.chevronWrapper}>
			<h3 className={classes.h3}>{t('Implementation')}</h3>
				<IconButton 
					className={classes.iconButton}
					onClick={handleChangeShowDetails}
				>
					<KeyboardArrowDownIcon className={clsx(classes.chevron, {
						[classes.chevronOpen]: !showDetails
					})}/>
				</IconButton>
			</div>
			<div className={classes.body}>
				<div className={classes.definitionTop}>
					<div className={classes.definitionTopLeft}>
						<span>{sloc} {t('lines')} ({sloc} sloc)</span>
						{" "}
						<span>{`${size} KB`}</span>
					</div>
					<div>
						<CopyTooltip
							copyText={JSON.stringify(content)}
							placement="top"
						>
							<CopyBtn classes={clsx(classes.downloadBtn, classes.copyBtn)}>
								{t('Copy')}
							</CopyBtn>
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
			<div className={classes.markdown}>
				<Markdown source={markdown}/>
			</div>
		</div>
	)
}

export default MainTab;