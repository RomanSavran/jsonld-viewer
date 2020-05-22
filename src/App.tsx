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
	PropertiesGrid,
	DataExplainer,
	Details
} from './routes';
import {
	makeStyles,
	createStyles
} from '@material-ui/core';
import ServiceAPI from './services/api';
import Spinner from './components/Spinner';
import { Theme } from '@material-ui/core';
import {
	getAppData,
} from './utils/helpers';
import TopBar from './components/TopBar';
import Breadcrumbs from './components/Breadcrumbs';
import { Error404 } from './components/Errors';

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
	const { propertiesList, classesList, manualPathVocab } = getAppData(data);

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
								propertiesData={propertiesList}
							/>
						)} />
						<Route path="/v2/data-explainer" exact component={() => (
							<DataExplainer 
								classesList={classesList}
								propData={propertiesList}
							/>
						)}/>
						<Route path="/v2/*" render={() => (
							<Details
								manualPathVocab={manualPathVocab}
								classesList={classesList}
								propData={propertiesList}
							/>
						)} />
						<Route path="/v2/404" exact component={Error404} />
						<Redirect to="/v2/404" />
					</Switch>
				</div>
			</RoutesContextProvider>
		</Router>

	)
}