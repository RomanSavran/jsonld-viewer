import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import { RoutesContext } from './context/RoutesContext';
import {
	ClassesHigherarchy,
	ClassesGrid,
	ClassesDetails,
	PropertiesGrid,
	PropertyDetails
} from './routes';
import {
	makeStyles,
	createStyles
} from '@material-ui/core';
import ServiceAPI from './services/api';
import Spinner from './components/Spinner';
import { Theme } from '@material-ui/core';
import {
	modifyClass,
	ClassItemType,
	modifyIdElement,
	modifyProps,
	IdElementType,
	PointersType,
	PropertyItemType
} from './utils/helpers';
import TopBar from './components/TopBar';
import Breadcrumbs from './components/Breadcrumbs';
import { Error404 } from './components/Errors';
import { useTranslation } from 'react-i18next';
import { Base64 } from 'js-base64';
import {keyBy} from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			padding: 20,
			[theme.breakpoints.down('md')]: {
				padding: 10
			}
		}
	})
);

export function App() {
	const classes = useStyles();
	const [value, setValue] = useState({
		data: [],
		loading: true,
		hasError: false
	});
	const {i18n} = useTranslation();
	const currentLanguage: string = i18n.language;
	const [currentPath, setCurrentPath] = useState
		<'classes-hierarchy' |
			'classes-grid' |
			'properties-grid'>
		('classes-hierarchy');

	const handleChangeCurrentPath = (path: 'classes-hierarchy' | 'classes-grid' | 'properties-grid') => {
		setCurrentPath(path);
	};

	useEffect(() => {
		let mounted = false;
		if (!mounted) {
			ServiceAPI.getOnto()
				.then(data => {
					setValue({
						data: JSON.parse(Base64.decode(data.content)),
						loading: false,
						hasError: false
					})
				})
				.catch(err => {
					console.error(err);
					setValue({
						data: [],
						loading: false,
						hasError: true
					})
				})
		}
	}, []);

	if (value.loading) return <Spinner />

	const { data } = value;
	const classesData: ClassItemType[] = [];
	const propertiesData: [] = [];
	const otherData: IdElementType[] = [];

	data.forEach(element => {
		if ('@type' in element) {
			const type: string = element['@type'][0];

			if (type.includes('owl#Class')) {
				classesData.push(modifyClass(element, currentLanguage));
			} else if (type.includes('owl#DatatypeProperty')) {
				propertiesData.push(element)
			}
		} else {
			otherData.push(modifyIdElement(element));
		}
	});

	const modifiedOtherData: PointersType = keyBy(otherData, 'id');
	const propData: PropertyItemType[] = propertiesData.map((item: any) => modifyProps(item, modifiedOtherData));

	return (
		<Router>
			<RoutesContext.Provider
				value={{
					currentPath,
					handleChangeCurrentPath
				}}
			>
				<TopBar />
				<Breadcrumbs />
				<div className={classes.container}>
					<Switch>
						<Route exact path="/">
							<Redirect to="/classes-hierarchy" />
						</Route>
						<Route path="/classes-hierarchy" exact render={() => (
							<ClassesHigherarchy
								classesData={classesData}
							/>
						)} />
						<Route path="/classes-grid" exact render={() => (
							<ClassesGrid
								classesData={classesData}
							/>
						)} />
						<Route path="/v1/Context/*" render={() => (
							<ClassesDetails
								classesData={classesData}
								propData={propData}
							/>
						)} />
						<Route path="/v1/Vocabulary/*" render={({ match }) => {
							const isClass = match.url.split('/')
								.some((s: string) => {
									return s === 'Identity' ||
											s === 'Link' || 
											s === 'PhysicalProperty' ||
											s === 'Technical' ||
											s === 'UnitOfMeasure';
								})
							return isClass ? (
								<ClassesDetails classesData={classesData} propData={propData}/>
							) : (
								<PropertyDetails classesData={classesData} propData={propData}/>
							)
						}} />
						<Route path="/v1/ClassDefinitions/*" render={() => (
							<ClassesDetails
								propData={propData}
								classesData={classesData}
							/>
						)} />
						<Route path="/properties-grid" exact render={() => (
							<PropertiesGrid
								propertiesData={propData}
							/>
						)} />
						<Route path="/404" exact component={Error404} />
						<Redirect to="/404" />
					</Switch>
				</div>
			</RoutesContext.Provider>
		</Router>

	)
}
