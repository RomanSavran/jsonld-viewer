import React from 'react';
import PropTypes from 'prop-types';
import { extractURL } from '../../services/utils';
import { withGlobalState } from '../hoc-helpers';
import { Link } from 'react-router-dom';
import { createParentChain } from '../../services/utils';
import PlatformTooltip from '../platform-tooltip';

function renderTable(obj) {
    const propsArray = Object.keys(obj).filter(name => '@id' in obj[name]);
    return propsArray.length ? (
        propsArray.sort().map(name => {
            let property = obj[name];
            const comment = 'dli:description' in property ? property['dli:description']['en-us'] : 'Has no description';
            const range = 'dli:valueType' in property ? property['dli:valueType'][0] : '';
            const category = 'subPropertyOf' in property ? property['subPropertyOf'] : '';

            return (
                <tr key={name}>
                    <td>
                        <span className="class-name-decor">
                            <Link to={`/v1/${property['@id'].split(':')[1]}`}>
                                {`:${name}`}
                            </Link>
                        </span>
                    </td>
                    <td>
                        {category}
                    </td>
                    <td>
                        {comment}
                    </td>
                    <td>
                        {range}
                    </td>
                </tr>
            )
        })
    ) : (
            <tr>
                <td colSpan="4" style={{ 'textAlign': 'center', 'fontSize': '20px' }}> Has no properties</td>
            </tr>
        )
}

function renderList(obj) {
    const propsArray = Object.keys(obj).filter(name => '@id' in obj[name]);
    return propsArray.length ? (
        propsArray.sort().map(name => {
            let property = obj[name];
            const comment = 'dli:description' in property ? property['dli:description']['en-us'] : 'Has no description';
            const range = 'dli:valueType' in property ? property['dli:valueType'][0] : '';
            const category = 'subPropertyOf' in property ? property['subPropertyOf'] : '';
            
            return (
                <div key={name} className="list-item">
                    <div>
                        <p className="prop-header">Property</p>
                        <span className="prop-text">
                            <span className="class-name-decor">
                                <Link to={`/v1/${property['@id'].split(':')[1]}`}>
                                    {`:${name}`}
                                </Link>
                            </span>
                        </span>
                    </div>
                    <div>
                        <p className="prop-header">Description</p>
                        <span className="prop-text">{comment}</span>
                    </div>
                    <div>
                        <p className="prop-header">Category</p>
                        <span className="prop-text">{category}</span>
                    </div>
                    <div>
                        <p className="prop-header">Range</p>
                        <span className="prop-text">{range}</span>
                    </div>
                </div>
            )
        })
    ) : (
            <div className="list-item fill-list">
                <span>Has no properties</span>
            </div>
        )
}

const GeneralInformation = (props) => {
    const { item, classes, data, definitionData } = props;
    const { width } = props.value;
    const itemData = data[item];
    const label = 'rdfs:label' in itemData ? itemData['rdfs:label']['en-us'] : 'Has no label';
    const comment = 'rdfs:comment' in itemData ? itemData['rdfs:comment']['en-us'] : 'Has no description';
    const superClasses = createParentChain(classes, `pot:${item}`);
    const itemProperties = definitionData['dli:supportedClass']['dli:supportedAttribute'];
    const tableData = renderTable(itemProperties);
    const listData = renderList(itemProperties);
    const uri = `https://standards.oftrust.net${window.location.pathname}`

    return (
        <>
            <h3 className="item-header">:{item}</h3>
            <div className="item-description-wrapper">
                <div className="item-description">
                    <div className="copy-block">
                        <h4 className="item-description__title">Context URI</h4>
                        <PlatformTooltip copyText={uri}/>
                    </div>
                    <a className="item-description__body item-description__body--link"
                        href={uri}
                        target="_blank"
                        rel="noopener noreferrer">{uri}</a>
                </div>
                <div className="item-description">
                    <h4 className="item-description__title">Label</h4>
                    <p className="item-description__body item-description__body--text">
                        {label}
                    </p>
                </div>
                <div className="item-description">
                    <h4 className="item-description__title">Description</h4>
                    <p className="item-description__body item-description__body--text">
                        {comment}
                    </p>
                </div>
                <div className="item-description">
                    <h4 className="item-description__title">Superclasses({superClasses.length})</h4>
                    <ul className="item-description__body item-description__body--list">
                        {
                            superClasses.map(el => {
                                let parentURL = '/v1/Context';
                                parentURL = el === 'dli:Role' ? `${parentURL}/Link/` : `${parentURL}/Identity/`;
                                const title = el.split(':')[1];
                                const label = (el.includes('dli') || el.includes('rdfs')) ?
                                    <span className="superclass-disabled">{el}</span> :
                                    <Link to={`${parentURL}${extractURL(classes, title)}`}>{`:${el.split(':')[1]}`}</Link>
                                return (
                                    <li key={el} className="superclass-decor">{label}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className="item-usage-wrapper">
                <h4>Usage</h4>
                <p>Instances of :{item} can have the following properties:</p>
                {
                    width > 768 ? (
                        <GeneralInfoTableView tableData={tableData} />
                    ) : (
                        <GeneralInfoListView listData={listData} />
                    )
                }
            </div>
        </>
    )
}

GeneralInformation.propTypes = {
    item: PropTypes.string.isRequired,
    classes: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    fullUrl: PropTypes.string.isRequired
}

const GeneralInfoTableView = ({ tableData }) => {
    return (
        <table className="item-usage-table">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Range</th>
                </tr>
            </thead>
            <tbody>
                {tableData}
            </tbody>
        </table>
    )
}

const GeneralInfoListView = ({ listData }) => {
    return (
        <div className="item-usage-list">
            {listData}
        </div>
    )
}

export default withGlobalState(GeneralInformation);