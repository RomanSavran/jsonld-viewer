import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { RoutesContext } from '../context/RoutesContext';
import {
	Grid,
	makeStyles,
	createStyles,
	TextField,
	useMediaQuery,
	useTheme,
	Theme,
	Tabs,
	Tab
} from '@material-ui/core';
import Tree from '../components/Tree';
import { 
	ClassItemType, 
	buildTree, 
	getRootNodes, 
	pathNameToTabValue, 
	tabValueToPathName,
	extractTextForDetails,
} from '../utils/helpers';
import { 
	GeneralInformation, 
	Vocabulary, 
	ClassDefinition, 
	Context,
	DataExample,
	JSONSchema
} from '../components/Tabs/Components';
import { Error404 } from '../components/Errors';
import { useTranslation } from 'react-i18next';

const tabsConfig: Array<{value: string, label: string}> = [
	{value: 'generalinformation', label: 'General Information'},
	{value: 'context', label: 'Context'},
	{value: 'vocabulary', label: 'Vocabulary'},
	{value: 'classdefinitions', label: 'Class Definitions'},
	{value: 'jsonschema', label: "JSON Schema"},
	{value: 'dataexample', label: 'Data Example'}
] 

type ClassesHigherarchyType = {
	classesList: any[],
	propData: any
}

const useStyles = makeStyles((theme) =>
	createStyles({
		inputRoot: {
			width: '100%',
			paddingLeft: 15,
			paddingRight: 15,
			fontSize: 15,
			border: '1px solid rgb(196, 203, 217)',
			color: 'rgb(70, 69, 69)',
			boxSizing: 'border-box'
		},
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

const ClassesDetails: React.FC<ClassesHigherarchyType> = ({ classesList, propData }) => {
	const classes = useStyles();
	const theme: Theme = useTheme();
	const {t, i18n} = useTranslation();
	const { currentPath } = useContext(RoutesContext);
	const location = useLocation();
	const history = useHistory();
	const isDesktop: boolean = !useMediaQuery(theme.breakpoints.down('md'));
	const [hasError, setHasError] = useState(false);
	const path: string = location.pathname
		.split('/')
		.filter(s => (
			!['', 'v1', 'context', 'classdefinitions', 'vocabulary', 'schema'].includes(s.toLowerCase())
		))
		.join('/');
	const currentTab: string = location.pathname.split('/v1/').pop()?.split('/')[0] || '';
	const id: string = path.split('/').pop() || '';
	const superclasses: string[] = useMemo(() => {
		return location.pathname
			.split(currentTab)
			.filter((s: string) => !!s)
			.pop()!
			.split('/')
			.filter((s: string) => !!s && s !== id);
	}, [currentTab, id, location.pathname])
	const [tabValue, setTabValue] = useState(pathNameToTabValue(currentTab));
	const [filter, handleFilterChange] = useState('');
	
	const element: ClassItemType | undefined = classesList.find(item => item.id === id);
	const isOnlyVocabulary: boolean = path
		.split('/')
		.some((s: string) => {
			return ['UnitOfMeasure', 'Technical', 'PhysicalProperty'].includes(s);
		}) || ['Identity', 'Link'].includes(id);
	const isOnlyContext: boolean = ['DataProductContext', 'SensorDataProductContext', 'LtifDataProductContext'].includes(id);
	const language: string = i18n.language;
	const shouldTreeView: boolean = currentPath === 'classes-hierarchy';

	const filteredTabsConfig: Array<{value: string, label: string}> = isOnlyVocabulary && !isOnlyContext ? [
		{value: 'generalinformation', label: 'General Information'},
		{value: 'vocabulary', label: 'Vocabulary'}
	] : isOnlyContext && !isOnlyVocabulary ? [
		{value: 'generalinformation', label: 'General Information'},
		{value: 'context', label: 'Context'},
		{value: 'jsonschema', label: "JSON Schema"},
		{value: 'dataexample', label: 'Data Example'}
	] : tabsConfig;

	const properties = useMemo(() => {
		return path.split('/')
			.filter((s: string) => !!s)
			.map((s: string) => {
				return propData.filter((element: any) => {
					return element.domain.length ? element.domain.some((domain: {url: string, label: string}) => {
						return domain.label === s;
					}) : false
				})
			})
			.flat()
			.map((item: any) => {
				return {
					...item, 
					label: extractTextForDetails(path, item, language, 'label'),
					comment: extractTextForDetails(path, item, language, 'comment')
				}
			})
	}, [language, path, propData]);

	console.log(propData);

	useEffect(() => {
		window.scrollTo(0, 0);
		setTabValue(pathNameToTabValue(currentTab));
		/* eslint-disable-next-line */
	}, [currentTab && id]);
	
	useEffect(() => {
		let mounted = false;
		
		if (location.pathname[location.pathname.length - 1] !== '/' && 
			['Context', 'General Information'].includes(currentTab)
		) {
			if (!mounted) {
				setHasError(true);
			}
		}

		return () => {
			mounted = true;
		}
		/* eslint-disable-next-line */
	}, [location.pathname]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		handleFilterChange(value);
	}

	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		const newPath = `/v1/${tabValueToPathName(newValue)}/${path}`.concat(
			['context', 'generalinformation', 'dataexample'].includes(newValue) ? '/' : ''
		);
		setTabValue(newValue);
		history.push(newPath);
	};

	const classesTree = useMemo(() => buildTree(classesList), [classesList]);
	const rootNodes = useMemo(() => getRootNodes(classesTree), [classesTree]);

	const label: string = element && element.label ? element.label : t('Has no label');
	const comment: string = element && element.comment ? element.comment : t('Has no description');
	const data = element ? {id, label, comment, superclasses} : null;

	return (
		<Grid
			container
			spacing={shouldTreeView && isDesktop ? 3 : 0}
		>
			{shouldTreeView && isDesktop ? (
				<Grid
					item
					xs={3}
				>
					<TextField
						className={classes.inputRoot}
						placeholder={t('Filter...')}
						value={filter}
						onChange={handleInputChange}
						InputProps={{
							disableUnderline: true
						}}
					/>
					<Tree
						filter={filter.toLowerCase()}
						rootNodes={rootNodes}
						tree={classesTree}
					/>
				</Grid>
			) : null}
			<Grid
				item
				xs={shouldTreeView && isDesktop ? 9 : 12}
			>
				{hasError ? <Error404 /> :
						(
							<>
								<Tabs
									classes={{
										root: classes.tabsRoot,
										indicator: classes.tabsIndicator,
										flexContainer: classes.tabsFlexContainer
									}}
									value={tabValue}
									onChange={handleTabChange}
									aria-label="Tabs"
								>
									{filteredTabsConfig.map(tabConfig => {
										return (
											<Tab
												value={tabConfig.value}
												key={tabConfig.value}
												label={t(tabConfig.label)}
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
									{tabValue === 'generalinformation' && <GeneralInformation 
										data={data}
										properties={properties} 
										id={id} 
										type="class"
									/>}
									{tabValue === 'context' && <Context path={path}/>}
									{tabValue === 'vocabulary' && <Vocabulary path={location.pathname}/>}
									{tabValue === 'classdefinitions' && <ClassDefinition path={location.pathname}/>}
									{tabValue === 'jsonschema' && <JSONSchema />}
									{tabValue === 'dataexample' && <DataExample path={location.pathname}/>}
								</div>
							</>
						)
				}
			</Grid>
		</Grid>
	)
}

export default ClassesDetails;