import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PageTitle from '../page-title';
import {Link} from 'react-router-dom';
import {withGlobalState} from '../hoc-helpers';
import {strToName, transformClasses, addToStorage, extractURL} from '../../services/utils';

const fields = ['@id','@type','subClassOf','Label','Comment','Same as','Equivalent class'];
function searchHelper(obj, field, filter) {
    return obj[field].toLowerCase().includes(filter)
}

class ClassesGrid extends PureComponent {
    static propTypes = {
        classes: PropTypes.array.isRequired
    }

    state = {
        '@id': '',
        '@type': '',
        'subClassOf': '',
        'label': '',
        'comment': '',
        'sameAs': '',
        'equivalentClass': '',
        filteredField: ''
    }

    componentDidMount() {
        this.props.value.closeNavView();
        const prevURL =  window.location.pathname.split('/').pop()
        this.props.value.setPrevURL(prevURL)
        addToStorage('prevURL', prevURL)
    }

    renderTable(filteredArray, fullData) {
        return filteredArray.map(el => {
            let url = extractURL(fullData, el['@id'].split(':')[1]);
            url = el['subClassOf'] === 'dli:Role' ? `Context/Link/${url}` : `Context/Identity/${url}`;

            const label = el['label'];
            const comment = el['comment'];

            return (
                <tr key={el['@id']}>
                    <td>
                        {el['@id'] === 'pot:Class' ? el['@id'] : <Link to={url}>{el['@id']}</Link>}
                    </td>
                    <td>{el['@type']}</td>
                    <td>{el['subClassOf']}</td>
                    <td>{label}</td>
                    <td>{comment}</td>
                    <td></td>
                    <td></td>
                </tr>
            )
        })
    }

    onSearchChange = (event, name) => {
        const { value } = event.target;
        this.setState({
            [name]: value,
            filteredField: name
        })
    }

    search(name, classes) {
        const filter = name ? this.state[name].toLowerCase() : '';

        switch (name) {
            case 'label':
                return classes.filter(el => searchHelper(el, 'label', filter))
            case 'comment':
                return classes.filter(el => searchHelper(el, 'comment', filter));
            case 'subClassOf':
                return classes.filter(el => searchHelper(el, 'subClassOf', filter));
            case '@id':
                return classes.filter(el => searchHelper(el, '@id', filter));
            case '@type':
                return classes.filter(el => searchHelper(el, '@type', filter));
            default:
                return classes
        }
    }

    render() {
        const { classes } = this.props;
        const transformedClasses = transformClasses(classes);
        const { filteredField } = this.state;
        const data = this.search(filteredField, transformedClasses).sort((a, b) => a['@id'] > b['@id'] ? 1 : -1);

        return (
            <>
                <PageTitle text="Pot viewer - Level 1"/>
                <div className="pot-viewer-table-wrapper">
                    <table className="pot-viewer-table">
                        <thead>
                            <tr>
                                {
                                    fields.map(el => {
                                        return (
                                            <th key={el}>
                                                {el}
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="search-row">
                                {
                                    fields.map(el => {
                                        const name = strToName(el)
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
                            {this.renderTable(data, classes)}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default withGlobalState(ClassesGrid);