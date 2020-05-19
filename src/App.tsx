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
	PropertyDetails,
	DataExplainer
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
	modifyClassElement,
} from './utils/helpers';
import TopBar from './components/TopBar';
import Breadcrumbs from './components/Breadcrumbs';
import { Error404 } from './components/Errors';
import keyBy from 'lodash/keyBy';
import P from './utils/platform-helper';
import {filterClassList} from './utils/lists';

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

		ServiceAPI.getData('/v2/')
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
				setValue({
					data: [],
					loading: false,
					hasError: true
				})
			})

		return () => {
			mounted = true;
		}
	}, []);

	if (value.loading) return <Spinner />

	const { data } = value;
	const classesList: Array<{ [key: string]: string }> = [];
	const propertiesData: any = [];
	const otherData: IdElementType[] = [];

	data.forEach((element: any) => {
		if ('@type' in element) {
			const type = P.getType(element['@type']);
			if (P.isClass(type)) {
				if (
					P.isVisibleClass(filterClassList, element['@id'])
				) {
					classesList.push(modifyClassElement(element));
				}
			} else if (P.isProperty(type)) {
				propertiesData.push(element)
			}
		} else {
			otherData.push(modifyIdElement(element));
		}
	});

	const modifiedOtherData: PointersType = keyBy(otherData, 'id');
	const propData: Array<{ [key: string]: any }> = propertiesData.map((item: any) => modifyProps(item, modifiedOtherData));

	return (
		<Router>
			<RoutesContextProvider>
				<TopBar />
				<Breadcrumbs />
				<div className={classes.container}>
					<Switch>
						<Route exact path="/">
							<Redirect to="/v2/" />
						</Route>
						<Route path="/v2/" exact render={() => (
							<ClassesHigherarchy
								classesList={classesList}
							/>
						)} />
						<Route path="/v2/classes-grid" exact render={() => (
							<ClassesGrid
								classesList={classesList}
							/>
						)} />
						<Route path="/v2/properties-grid" exact render={() => (
							<PropertiesGrid
								propertiesData={propData}
							/>
						)} />
						<Route path="/v2/data-explainer" exact component={() => (
							<DataExplainer 
								classesList={classesList}
								propData={propData}
							/>
						)}/>
						<Route path="/v2/*" render={() => (
							<ClassesDetails
								classesList={classesList}
								propData={propData}
							/>
						)} />
						<Route path="/v2/Vocabulary/*" render={({ match }) => {
							const isClass = match.url.split('/')
								.some((s: string) => {
									return [
										'Identity',
										'Annotation',
										'Link',
										'PhysicalProperty',
										'Technical',
										'UnitOfMeasure',
										'DataProductContext'
									].includes(s);
								})
							return isClass ? <ClassesDetails classesList={classesList} propData={propData} /> :
								<PropertyDetails classesList={classesList} propData={propData} />
						}} />
						<Route path="/v2/404" exact component={Error404} />
						<Redirect to="/v2/404" />
					</Switch>
				</div>
			</RoutesContextProvider>
		</Router>

	)
}