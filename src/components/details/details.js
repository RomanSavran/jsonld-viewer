import React, { Component } from 'react';
import RouterTabs from '../tabs';
import ErrorIndicator from '../error-indicator';
import DetailsView from '../details-view';
import { MainTab, GeneralInformation } from '../tabs-components';
import { parser, isEmptyProps, createURL, getFromStorage } from '../../services/utils';
import Tree from '../tree';
import { withRouter, Redirect } from 'react-router-dom';
import GithubApi from '../../services/api';
import Spinner from '../spinner';
import PropTypes from 'prop-types';
import {withGlobalState} from '../hoc-helpers';
import mdFileCD from '../../documentation/ClassdefinitionOverview.md';
import mdFileCV from '../../documentation/context.md';
import { Base64 } from 'js-base64';
import './details.scss';

const githubApi = new GithubApi();
const tabView = [
    'General information',
    'Context',
    'Vocabulary',
    'Class definition',
    'Data example'
];

function updateState(dt) {
    return {
        content: parser(Base64, dt.content),
        size: (dt.size / 1024).toFixed(2),
        sloc: Base64.decode(dt.content).split('\n').length
    }
}

class Details extends Component {
    static propTypes = {
        classes: PropTypes.array.isRequired
    }

    state = {
        contextData: {
            content: null,
            size: null
        },
        classDefinitionData: {
            content: null,
            size: null,
            url: null
        },
        vocabularyData: {
            content: null,
            size: null,
            sloc: null,
            url: null
        },
        hasError: false
    }

    componentDidMount() {
        this.props.value.closeNavView();
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params[0] !== prevProps.match.params[0]) {
            this.fetchData();
        }
    }

    fetchData = () => {
        const {classes} = this.props
        const { params } = this.props.match;
        const hasAnyClass = params[0].split('/').pop() !== '' ? classes.some(el => el['@id'].toLowerCase() === `pot:${params[0].toLowerCase().split('/').pop()}`) : false;
        
        if (!hasAnyClass) {
            return ;
        }

        const {mainURL, contextURL} = createURL(params[0], classes);

        Promise.all([
            githubApi.getData(`v1/Vocabulary/${mainURL}`),
            githubApi.getData(`v1/Context/${contextURL}`),
            githubApi.getData(`v1/ClassDefinitions/${mainURL}`)
        ]).then(data => {
            const [vocabularyData, contextData, classDefData] = data;
            this.setState({
                contextData: {...updateState(contextData)},
                vocabularyData: {
                    ...updateState(vocabularyData),
                    url: parser(Base64, contextData.content)['@context']['@vocab']
                },
                classDefinitionData: {
                    ...updateState(classDefData),
                    url: parser(Base64, contextData.content)['@context']['@classDefinition']
                },
                hasError: false
            })
        }, _ => {
            this.setState({
                hasError: true
            })
        })
    }

    render() {
        const { contextData, classDefinitionData, vocabularyData, hasError} = this.state;
        const { classes, properties } = this.props;
        const { params } = this.props.match;
        const prevURL = this.props.value.prevURL || getFromStorage('prevURL') || 'classes-higherarchy';
        const hasAnyClass = params[0].split('/').pop() !== '' ? classes.some(el => el['@id'].toLowerCase() === `pot:${params[0].toLowerCase().split('/').pop()}`) : false;
        const leftData = prevURL === 'classes-grid' ? null : <Tree data={classes} />

        if (!hasAnyClass) {
            return (
                <DetailsView
                    leftData={leftData}
                    rightData={<Redirect to={`/v1/${prevURL}`}/>}
                />
            )
        }

        const {contextURL, item} = createURL(params[0], classes);
        const emptyData = !isEmptyProps(contextData, classDefinitionData, vocabularyData) || !vocabularyData.content[item];
        const rightData = hasError ? ( <ErrorIndicator /> ) : 
                         !hasAnyClass ? ( "Choose any class" ) : 
                          emptyData ? ( <Spinner />) : 
                                    (
                                        <RouterTabs tabView={tabView}>
                                            <GeneralInformation classes={classes} properties={properties} 
                                                                item={item} data={vocabularyData.content} definitionData={classDefinitionData.content} 
                                                                fullUrl={contextURL}/>
                                            <MainTab data={contextData} mdFileSrc={mdFileCV} fileName={`Context-${item}`}/>
                                            <MainTab data={vocabularyData} mdFileSrc={mdFileCV} fileName={`Vocabulary-${item}`}/>
                                            <MainTab data={classDefinitionData} mdFileSrc={mdFileCD} fileName={`ClassDefinition-${item}`}/>
                                            <h2>Data example</h2>
                                        </RouterTabs>
                                    )

        return (
            <DetailsView
                leftData={leftData}
                rightData={rightData}
            />
        )
    }
}

export default withRouter(withGlobalState(Details));