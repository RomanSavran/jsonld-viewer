import React, { useState, useEffect, useMemo } from 'react';
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
import { Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
	getAppData,
} from './utils/helpers';
import TopBar from './components/TopBar';
import Breadcrumbs from './components/Breadcrumbs';
import { Error404 } from './components/Errors';
import InitLoader from './components/InitLoader';
import Footer from './components/Footer';

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

	const { t } = useTranslation();

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

	const { data } = value;
	const { propertiesList, classesList, manualPathVocab } = useMemo(() => getAppData(data), [data]);

	return (
		<Router>
			<RoutesContextProvider>
				{value.loading ? <InitLoader /> : (
					<>
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
										manualPathVocab={manualPathVocab}
										classesList={classesList}
										propData={propertiesList}
									/>
								)} />
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
						<div style={{ visibility: "collapse" }} className="wrap-div">
							<div className="cont">
								<div className="div-center-wrapper-button">
									{t('Are you in need of a new ontology or have other suggestions?')}
								</div>
								<div className="button-wrapper">
									<a
										className="button"
										href="https://github.com/PlatformOfTrust/collected-feedback/issues/new?assignees=&labels=ontology-viewer&template=ontology-wishlist.md&title=%5bOntology%20Viewer%3A%20Wishlist%20or%20Issue%5d">
										{t('Tell us in GitHub')}
									</a>
								</div>
							</div>
						</div>
						<Footer />
					</>
				)}
			</RoutesContextProvider>
		</Router>
	)
}