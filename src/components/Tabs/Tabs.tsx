import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
	Tabs,
	Tab,
	makeStyles,
	createStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) =>
	createStyles({
		tabRoot: {
			minWidth: 'auto',
			textTransform: 'none',
			padding: '15px 25px',
			color: '#4C4C51',
			transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
			[theme.breakpoints.down('xs')]: {
				padding: '10px'
			}
		},
		tabWrapper: {
			position: 'relative',
			zIndex: 999,
			fontSize: 12,
			fontWeight: 600,
			lineHeight: '12px',
			fontFamily: 'Montserrat'
		},
		tabSelected: {
			color: '#fff',
			[theme.breakpoints.down('xs')]: {
				background: '#0095FF',
				transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
				outline: 'none'
			}
		},
		tabsRoot: {
			borderBottom: '2px solid #0095ff',
			[theme.breakpoints.down('xs')]: {
				border: 'none'
			}
		},
		tabsIndicator: {
			height: '100%',
			background: '#0095FF',
			[theme.breakpoints.down('xs')]: {
				display: 'none'
			}
		},
		tabsFlexContainer: {
			[theme.breakpoints.down('xs')]: {
				display: 'flex',
				flexWrap: 'wrap'
			}
		}
	})
);

type RouterTabsTypes = {
	tabTitles: string[],
	children: React.ReactNode[]
}

const RouterTabs: React.FC<RouterTabsTypes> = (props) => {
	const classes = useStyles();
	const {
		tabTitles,
		children
	} = props;
	const tabsConfig: Array<{value: string, label: string}> = [
		{value: 'generalinformation', label: 'General Information'},
		{value: 'context', label: 'Context'},
		{value: 'vocabulary', label: 'Vocabulary'},
		{value: 'classdefinitions', label: 'Class Definitions'}
	] 
	const location = useLocation();
	const currentTab = location.pathname.split('/v1/').pop()?.split('/')[0];
	console.log(currentTab)
	const id: string = location.pathname.split('/').pop() || '';
	const history = useHistory();
	const path: string = location.pathname
		.split('/')
		.filter(s => !!s)
		.join('/');

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		// setValue(newValue)
		// if (newValue === 1) {
		// 	history.push(`/${path}/`);
		// } else {
		// 	history.push(`/${path}`)
		// }
	}

	return (
		<>
			<Tabs
				classes={{
					root: classes.tabsRoot,
					indicator: classes.tabsIndicator,
					flexContainer: classes.tabsFlexContainer
				}}
				value={0}
				onChange={handleChange}
				aria-label="Tabs"
			>
				{tabsConfig.map(tabConfig => {
					return (
						<Tab
							key={tabConfig.value}
							label={tabConfig.label}
							classes={{
								root: classes.tabRoot,
								wrapper: classes.tabWrapper,
								selected: classes.tabSelected
							}}
						/>
					)
				})}
			</Tabs>
			<div>
				{React.Children.toArray(children).filter((child, idx) => {
					console.log(child);
					return idx === 0
				})}
			</div>
		</>
	)
}

export default React.memo(RouterTabs);