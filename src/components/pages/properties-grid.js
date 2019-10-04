import React, { Component } from 'react';
import { strToName, addToStorage, extractPropsURL, transformProperties } from '../../services/utils';
import { withGlobalState } from '../hoc-helpers';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const fields = ['@id', 'Category', 'Label', 'Comment', 'Domain', 'Range'];

function searchHelper(obj, field, filter) {
    return obj[field].toLowerCase().includes(filter)
}

class PropertiesGrid extends Component {

    static propTypes = {
        properties: PropTypes.array.isRequired
    }

    state = {
        '@id': '',
        'category': '',
        'label': '',
        'comment': '',
        'domain': '',
        'range': '',
        filteredField: ''
    }

    componentDidMount() {
        this.props.value.closeNavView();
        const prevURL = window.location.pathname.split('/').pop()
        this.props.value.setPrevURL(prevURL)
        addToStorage('prevURL', prevURL)
    }

    onSearchChange = (event, name) => {
        const { value } = event.target;
        this.setState({
            [name]: value,
            filteredField: name
        })
    }

    search(name, properties) {
        const filter = name ? this.state[name].toLowerCase() : '';

        switch (name) {
            case 'label':
                return properties.filter(el => searchHelper(el, 'label', filter))
            case 'comment':
                return properties.filter(el => searchHelper(el, 'comment', filter))
            case 'category':
                    return properties.filter(el => searchHelper(el, 'category', filter))
            case '@id':
                return properties.filter(el => searchHelper(el, '@id', filter));
            case 'range':
                return properties.filter(el => searchHelper(el, 'range', filter))
            case 'domain':
                return properties.filter(el => searchHelper(el, 'domain', filter))
            default:
                return properties
        }
    }

    renderTable(data) {
        const { properties } = this.props;
        
        return data.sort((a, b) => a['@id'] > b['@id'] ? 1 : -1).map(field => {
            const id = field['@id']
            const category = field['category']
            const label = field['label']
            const comment = field['comment']
            const range = field['range']
            const domain = field['domain']
            const url = `/v1/${extractPropsURL(properties, field['@id'])}`

            return (
                <tr key={id}>
                    <td>
                        <Link to={url}>{id}</Link>
                    </td>
                    <td>{category}</td>
                    <td>{label}</td>
                    <td>{comment}</td>
                    <td>{domain}</td>
                    <td>{range}</td>
                </tr>
            )
        });
    }

    render() {
        const {filteredField} = this.state;
        const {properties} = this.props;
        const transformedProperties = transformProperties(properties);
        const data = this.search(filteredField, transformedProperties)

        return (
            <div className="pot-viewer-table-wrapper">
                <h2 className="page-title">Properties viewer</h2>
                <table className="pot-viewer-table">
                    <thead>
                        <tr>
                            {fields.map(field => {
                                return <th key={field}>{field}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="search-row">
                            {
                                fields.map(el => {
                                    const name = strToName(el);
                                    return (
                                        <td key={el}>
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                name={name}
                                                value={this.state[name]}
                                                onChange={(event) => this.onSearchChange(event, name)} />
                                            <span className="search-icon">
                                                <i className="fas fa-search"></i>
                                            </span>
                                        </td>
                                    )
                                })
                            }
                        </tr>
                        {this.renderTable(data)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withGlobalState(PropertiesGrid)