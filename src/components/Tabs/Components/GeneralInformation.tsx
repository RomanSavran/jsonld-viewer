import React, {useState} from 'react';
import {
	makeStyles,
	createStyles,
	Theme
} from '@material-ui/core';
import Table from '../../Table';
import { ClassItemType } from '../../../utils/helpers';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Info from '../../Info';
import Error404 from '../../Errors/Error404';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		itemTitle: {
			margin: 0,
			marginRight: 10,
			marginBottom: 20,
			fontSize: 23,
			fontWeight: 600,
			lineHeight: '28px',
			color: '#fff',
			[theme.breakpoints.down('md')]: {
				fontSize: 18
			}
		},
		tableDescription: {
			margin: 0,
			fontSize: 18,
			marginBottom: 25,
			color: '#fff',
			[theme.breakpoints.down('md')]: {
				marginBottom: 10,
				fontSize: 14
			}
		},
	}),
);

type GeneralInformationTypes = {
	id: string,
	vocabData?: any,
	properties?: any,
	type: 'class' | 'prop',
	classesData?: ClassItemType[],
	data?: any,
	shouldTreeView: boolean,
	uriList?: any
}

const initHeaders: Array<{id: string, label: string}> = [
	{id: 'category', label: 'Property category'},
	{id: 'id', label: 'Property'},
	{id: 'label', label: 'Label'},
	{id: 'comment', label: 'Description'},
	{id: 'range', label: 'Range'}
]

const GeneralInformation: React.FC<GeneralInformationTypes> = (props) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const [order, setOrder] = useState<'asc' | 'desc'>('asc');
	const [orderBy, setOrderBy] = useState('id');
	const {
		id,
		properties,
		data,
		type,
		shouldTreeView,
		uriList
	} = props;
	const location = useLocation();
	
	if (!data) return <Error404 />
	
	const {label, comment, superclasses} = data;

	const classLink: string = location.pathname
		.split('/')
		.filter(s => {
			return !['v2', 'classdefinitions', 'context', 'vocabulary', ''].includes(s.toLowerCase());
		})
		.join('/');

	const isOnlyVocabulary: boolean = classLink
		.split('/')
		.some((s: string) => {
			return ['UnitOfMeasure', 'Technical', 'PhysicalProperty', 'Annotation'].includes(s);
		}) || ['Identity', 'Link'].includes(id);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property);
	}

	const headers = !shouldTreeView && i18n.language === 'en' ? [
		{id: 'category', label: 'Property category'},
		{id: 'id', label: 'Property'},
		{id: 'labelEn', label: 'Label'},
		{id: 'commentEn', label: 'Description'},
		{id: 'range', label: 'Range'}
	] : !shouldTreeView && i18n.language === 'fi' ? [
		{id: 'category', label: 'Property category'},
		{id: 'id', label: 'Property'},
		{id: 'labelEn', label: 'Label (en-us)'},
		{id: 'labelFi', label: 'Label (fi-fi)'},
		{id: 'commentEn', label: 'Description (en-us)'},
		{id: 'commentFi', label: 'Description (en-us)'},
		{id: 'range', label: 'Range'}
	] : initHeaders;

	return (
		<div>
			<Info 
				label={label}
				comment={comment}
				id={id}
				isOnlyVocabulary={isOnlyVocabulary}
				superclasses={superclasses}
				type={type}
				uriList={uriList}
			/>
			<div>
				<h4 className={classes.itemTitle}>{t('Usage')}</h4>
				{type === 'prop' ? null : <p className={classes.tableDescription}>{t('Instances', {id})}</p>}
				<Table 
					headers={headers}
					order={order}
					orderBy={orderBy}
					data={properties}
					handleRequestSort={handleRequestSort}
				/>
			</div>
		</div>
	)
}

export default React.memo(GeneralInformation);