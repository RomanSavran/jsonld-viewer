import React from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { createPropertyParentChain, extractPropsURL, transformProperties, extractURL, isSameProps } from '../../services/utils';
import PlatformTooltip from '../platform-tooltip';
import {withGlobalState} from '../hoc-helpers';
import PropTypes from 'prop-types';
import './property-details.scss';

function renderTable(classes, data) {
    return data.length ? (
        data.sort().map(el => {
            const id = el['@id'];
            const parent = el['subClassOf'];
            const comment = 'dli:comment' in el ? el['dli:comment'][0]['rdfs:comment']['@value'] : 'Has no description';
            let url = extractURL(classes, el['@id'].split(':')[1]);
            url = el['subClassOf'] === 'dli:Role' ? `/v1/Context/Link/${url}` : `/v1/Context/Identity/${url}`;

            return (
                <tr key={id}>
                    <td>
                        <span className="class-name-decor">
                            {id === 'pot:Class' ? id : <Link to={url}>{id}</Link>}
                        </span>
                    </td>
                    <td>
                        {parent}
                    </td>
                    <td>
                        {comment}
                    </td>
                </tr>
            )
        })) : (
            <tr>
                <td colSpan="3" style={{ 'textAlign': 'center', 'fontSize': '20px' }}> Has no classes</td>
            </tr>
        );
}

function renderList(classes, data) {
    return data.length ? (
        data.sort().map(el => {
            const id = el['@id'];
            const parent = el['subClassOf'];
            const comment = 'dli:comment' in el ? el['dli:comment'][0]['rdfs:comment']['@value'] : 'Has no description';
            let url = extractURL(classes, el['@id'].split(':')[1]);
            url = el['subClassOf'] === 'dli:Role' ? `/v1/Context/Link/${url}` : `/v1/Context/Identity/${url}`;

            return (
                <div key={id} className="list-item">
                    <div>
                        <p className="prop-header">Class</p>
                        <span className="prop-text">
                            <span className="class-name-decor">
                                {id === 'pot:Class' ? id : <Link to={url}>{id}</Link>}
                            </span>
                        </span>
                    </div>
                    <div>
                        <p className="prop-header">subClassOf</p>
                        <span className="prop-text">{parent}</span>
                    </div>
                    <div>
                        <p className="prop-header">Comment</p>
                        <span className="prop-text">{comment}</span>
                    </div>
                </div>
            )
        })) : (
            <div className="list-item fill-list">
                <span>Has no classes</span>
            </div>
        );
}

const PropertyDetails = (props) => {
    const { properties, classes, value: {width} } = props;
    let itemName = props.match.params[0].split('/').pop();
    const transformedProperties = transformProperties(properties);

    if (!transformedProperties.filter(el => el['@id'].split(':')[1] === itemName).length) {
        return <Redirect to="/v1/classes-higherarchy"/>
    }

    const [item] = transformedProperties.filter((el, index, array) => {
        if (isSameProps(array, itemName)) {
            return props.match.params[0].split('/').length === 1 ? el['@id'] === `dli:${itemName}` : el['@id'] === `pot:${itemName}`
        }
        
        return el['@id'].split(':')[1] === itemName
    })
    const uri = `https://standards.oftrust.net${props.match.url}`
    const label = item['label'] || 'Has no label';
    const comment = item['comment'] || 'Has no description';
    const classesInAction = classes.filter(el => item['domain'].includes(el['@id']))
    const tableData = renderTable(classes, classesInAction);
    const listData = renderList(classes, classesInAction);
    const subProperties = createPropertyParentChain(properties, item);

    return (
        <div className="prop-detail">
            <h3 className="item-header">{`:${itemName}`}</h3>
            <div className="item-description-wrapper">
                <div className="item-description">
                    <div className="copy-block">
                        <h4 className="item-description__title">URI</h4>
                        <PlatformTooltip copyText={uri} />
                    </div>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={uri}
                        className="item-description__body item-description__body--link"
                    >{uri}</a>
                </div>
                <div className="item-description">
                    <h4 className="item-description__title">Label</h4>
                    <p className="item-description__body item-description__body--text">{label}</p>
                </div>
                <div className="item-description">
                    <h4 className="item-description__title">Description</h4>
                    <p className="item-description__body item-description__body--text">{comment}</p>
                </div>
                <div className="item-description">
                    <h4 className="item-description__title">Categories ({subProperties.length})</h4>
                    <ul className="item-description__body item-description__body--list">
                        {subProperties.length ? subProperties.map(fullName => {
                            const propName = `:${fullName.split(':')[1]}`
                            let parentURL = extractPropsURL(properties, fullName);
                            return (
                                <li key={propName} className="superclass-decor">
                                    <Link to={`/v1/${parentURL}`}>{propName}</Link>
                                </li>
                            )
                        }) : <li className="empty">Has no categories</li>}
                    </ul>
                </div>
            </div>
            <div className="item-usage-wrapper">
                <h4>Usage</h4>
                {
                    width > 768 ? (
                        <TableView tableData={tableData}/>
                    ) : (
                        <ListView listData={listData} />
                    )
                }
                
            </div>
        </div>
    )
}

PropertyDetails.propTypes = {
    classes: PropTypes.array.isRequired,
    properties: PropTypes.array.isRequired
}

const TableView = ({ tableData }) => {
    return (
        <table className="item-usage-table">
            <thead>
                <tr>
                    <th>Class</th>
                    <th>subClassOf</th>
                    <th>Comment</th>
                </tr>
            </thead>

            <tbody>
                {tableData}
            </tbody>
        </table>
    )
}

const ListView = ({ listData }) => {
    return (
        <div className="item-usage-list">
            {listData}
        </div>
    )
}

export default withRouter(withGlobalState(PropertyDetails))