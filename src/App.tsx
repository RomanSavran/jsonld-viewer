import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import { RoutesContextProvider } from './context/RoutesContext';
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
	modifyIdElement,
	modifyProps,
	IdElementType,
	PointersType,
	modifyClassElement
} from './utils/helpers';
import TopBar from './components/TopBar';
import Breadcrumbs from './components/Breadcrumbs';
import { Error404 } from './components/Errors';
import keyBy from 'lodash/keyBy';

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

	useEffect(() => {
		let mounted = false;

		ServiceAPI.getData('/v1/')
			.then(data => {
				if (!mounted) {
					setValue({
						data,
						loading: false,
						hasError: false
					})
				}
			})
			.catch(err => {
				if (!mounted) {
					setValue({
						data: [],
						loading: false,
						hasError: true
					})
				}
			})

		return () => {
			mounted = true;
		}
	}, []);

	if (value.loading) return <Spinner />

	const { data } = value;
	const classesList: Array<{ [key: string]: string }> = [
		{
			url: '/v1/Context/DataProductContext/',
			id: 'DataProductContext',
			labelEn: '',
			labelFi: '',
			commentEn: '',
			commentFi: '',
			subClass: '',
		},
		{
			url: '/v1/Context/DataProductContext/SensorDataProductContext/',
			id: 'SensorDataProductContext',
			labelEn: '',
			labelFi: '',
			commentEn: '',
			commentFi: '',
			subClass: 'DataProductContext'
		},
		{
			url: '/v1/Context/DataProductContext/LtifDataProductContext/',
			id: 'LtifDataProductContext',
			labelEn: '',
			labelFi: '',
			commentEn: '',
			commentFi: '',
			subClass: 'DataProductContext'
		}
	];
	const propertiesData: [] = [];
	const otherData: IdElementType[] = [];

	data.forEach(element => {
		if ('@type' in element) {
			const type: string = element['@type'][0];
			if (type.includes('owl#Class')) {
				classesList.push(modifyClassElement(element));
			} else if (type.includes('owl#DatatypeProperty')) {
				propertiesData.push(element)
			}
		} else {
			otherData.push(modifyIdElement(element));
		}
	});

	const modifiedOtherData: PointersType = keyBy(otherData, 'id');
	const propData: Array<{[key: string]: any}> = propertiesData.map((item: any) => modifyProps(item, modifiedOtherData));

	return (
		<Router>
			<RoutesContextProvider>
				<TopBar />
				<Breadcrumbs />
				<div className={classes.container}>
					<Switch>
						<Route exact path="/">
							<Redirect to="/v1/" />
						</Route>
						<Route path="/v1/" exact render={() => (
							<ClassesHigherarchy
								classesList={classesList}
							/>
						)} />
						<Route path="/classes-grid" exact render={() => (
							<ClassesGrid
								classesList={classesList}
							/>
						)} />
						<Route path="/v1/Context/*" render={() => (
							<ClassesDetails
								classesList={classesList}
								propData={propData}
							/>
						)} />
						<Route path="/v1/Schema/*" render={() => (
							<ClassesDetails
								classesList={classesList}
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
										s === 'UnitOfMeasure' ||
										s === 'DataProductContext';
								})
							return isClass ? (
								<ClassesDetails classesList={classesList} propData={propData} />
							) : (
									<PropertyDetails classesList={classesList} propData={propData} />
								)
						}} />
						<Route path="/v1/ClassDefinitions/*" render={() => (
							<ClassesDetails
								propData={propData}
								classesList={classesList}
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
			</RoutesContextProvider>
		</Router>

	)
}