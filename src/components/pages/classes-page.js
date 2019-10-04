import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Tree from '../tree';
import {addToStorage} from '../../services/utils';
import {withGlobalState} from '../hoc-helpers';

class ClassesPage extends PureComponent {
    static propTypes = {
        classes: PropTypes.array.isRequired
    }

    componentDidMount() {
        this.props.value.closeNavView();
        const prevURL =  window.location.pathname.split('/').pop();
        this.props.value.setPrevURL(prevURL);
        addToStorage('prevURL', prevURL)
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <Tree data={this.props.classes} />
                </div>
            </div>
        )
    }
}

export default withGlobalState(ClassesPage);