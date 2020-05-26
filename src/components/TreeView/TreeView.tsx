import React, { useState, useMemo, useContext, useEffect } from 'react';
import {
	TextField,
	makeStyles
} from '@material-ui/core';
import { buildTree, getRootNodes } from '../../utils/helpers';
import {RoutesContext} from '../../context/RoutesContext';
import Tree from '../Tree';
import { useTranslation } from 'react-i18next';

type TreeViewProps = {
	classesList: Array<{[key: string]: string}>
}

const useStyles = makeStyles(theme => ({
	root: {
		overflow: 'hidden'
	},
	inputRoot: {
		width: '100%',
		paddingLeft: 15,
		paddingRight: 15,
		fontSize: 15,
		background: '#fff',
		borderRadius: 20,
		color: 'rgb(70, 69, 69)',
		boxSizing: 'border-box'
	}
}));

const TreeView: React.FC<TreeViewProps> = ({ 
    classesList 
}) => {
	const classes = useStyles();
	const {t} = useTranslation();
	const [filter, handleFilterChange] = useState('');
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		handleFilterChange(value);
	}

	const {handleChangeCurrentPath} = useContext(RoutesContext);

	useEffect(() => {
        handleChangeCurrentPath('classes-hierarchy');
    }, [handleChangeCurrentPath]);

	const classesTree = useMemo(() => buildTree(classesList), [classesList]);
	const rootNodes = useMemo(() => getRootNodes(classesTree), [classesTree]);

	const manualSortRootNodes = [
		...rootNodes.slice(1),
		...rootNodes.slice(0, 1)
	];

	return (
		<div className={classes.root}>
			<TextField
				className={classes.inputRoot}
				placeholder={t("Filter...")}
				value={filter}
				onChange={handleChange}
				InputProps={{
					disableUnderline: true
				}}
			/>
			<Tree
				filter={filter.toLowerCase()}
				rootNodes={manualSortRootNodes}
				tree={classesTree}
			/>
		</div>
	)
}

export default React.memo(TreeView);