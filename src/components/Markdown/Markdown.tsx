import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core';
import Markdown from 'react-markdown';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		markdown: {
			padding: 20,
			border: '2px solid rgb(235, 240, 248)',
			background: '#eaf5ff',
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
				color: '#7955ff',
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
	})
);

type MarkdownProps = {
    source: any
}

const MarkdownPT: React.FC<MarkdownProps> = ({
    source
}) => {
    const classes = useStyles();
    return (
        <div className={classes.markdown}>
            <Markdown source={source} />
        </div>
    )
}

export default MarkdownPT;