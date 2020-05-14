import React, { useState, useMemo, useContext, useEffect } from 'react';
import {
	TextField,
	makeStyles
} from '@material-ui/core';
import { buildTree, getRootNodes } from '../utils/helpers';
import Tree from '../components/Tree';
import { RoutesContext } from '../context/RoutesContext';
import { useTranslation } from 'react-i18next';

type ClassesHigherarchyType = {
	classesList: Array<{[key: string]: string}>
}

const useStyles = makeStyles(theme => ({
	inputRoot: {
		width: '100%',
		paddingLeft: 15,
		paddingRight: 15,
		fontSize: 15,
		border: '1px solid rgb(196, 203, 217)',
		color: 'rgb(70, 69, 69)',
		boxSizing: 'border-box'
	}
}));

const ClassesHigherarchy: React.FC<ClassesHigherarchyType> = ({ classesList }) => {
	const {handleChangeCurrentPath} = useContext(RoutesContext);
	const classes = useStyles();
	const {t} = useTranslation();
	const [filter, handleFilterChange] = useState('');

	useEffect(() => {
        handleChangeCurrentPath('classes-hierarchy');
    }, [handleChangeCurrentPath]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		handleFilterChange(value);
	}

	const classesTree = useMemo(() => buildTree(classesList), [classesList]);
	const rootNodes = useMemo(() => getRootNodes(classesTree), [classesTree]);

	const manualSortRootNodes = [
		...rootNodes.slice(1),
		...rootNodes.slice(0, 1)
	];

	return (
		<>
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
		</>
	)
}

export default ClassesHigherarchy;