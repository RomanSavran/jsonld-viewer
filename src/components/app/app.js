import React, {Component} from 'react';
import ErrorBoundary from '../error-boundary';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {WindowProvider} from '../../services/state';
import Header from '../header';
import Footer from '../footer';
import ScrollToTop from '../scroll-to-top';
import PageNavigation from '../page-navigation';
import GithubApi from '../../services/api';
import Details from '../details';
import {extractData} from '../../services/utils';
import {ClassesPage, ClassesGrid, PropertiesGrid} from '../pages';
import ErrorIndicator from '../error-indicator';
import PropertyDetails from '../property-details';
import Spinner from '../spinner';
import { Base64 } from 'js-base64';
import {parser} from '../../services/utils';
import './app.scss';

const githubApi = new GithubApi();

export default class App extends Component {

    state = {
        data: null,
        loading: true,
        hasError: false
    }

    componentDidMount() {
        githubApi
            .getData('v1/Ontology/pot')
            .then(data => {
                this.setState({ 
                    data: parser(Base64, data.content),
                    loading: false
                })
            })
            .catch(err => {
                console.error(err);
                this.setState({ 
                    loading: false,
                    hasError: true
                })
            })
    }

    render() {
        const {data, hasError} = this.state;

        if (!data && !hasError) {
            return (
                <AppView>
                    <Spinner />
                </AppView>
            )
        }

        if (hasError) {
            return <ErrorIndicator />
        }

        const classes = extractData(data.defines, 'pot:Class');
        const properties = extractData(data.defines, 'rdf:Property');

        return (
            <AppView>
                <div className="platform-content-wrapper">
                    <Switch>
                        <Route path="/v1/classes-higherarchy" exact render={() => <ClassesPage classes={classes}/>}/>
                        <Route path="/v1/classes-grid" exact render={() => <ClassesGrid classes={classes}/>}/>
                        <Route path="/v1/Context/*" exact render={() => <Details classes={classes}/>}/>
                        <Route path="/v1/properties-grid" exact render={() => <PropertiesGrid properties={properties}/>} />
                        <Route path="/v1/*" exact render={() => <PropertyDetails properties={properties} classes={classes}/>}/>
                        <Redirect to="/v1/classes-higherarchy"/>
                    </Switch>
                </div>
            </AppView>
        )
    }
}

const AppView = ({children}) => {
    return (
        <ErrorBoundary>
            <Router>
                <WindowProvider>
                    <ScrollToTop>
                        <Header />
                        <PageNavigation />
                        {children}
                        <Footer />
                    </ScrollToTop>
                </WindowProvider>
            </Router>
        </ErrorBoundary>
    )
}