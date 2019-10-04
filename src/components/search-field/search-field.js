import React, {PureComponent} from 'react';
import './search-field.scss';

export default class SearchField extends PureComponent {
    state = {
        filter: ''
    }

    onSearchChange = (event) => {
        const filter = event.target.value;
        this.setState({ filter });
        this.props.searchHandler(filter);
    }

    render() {
        return (
            <input 
                className="search-field"
                type="text"
                onChange={(event) => this.onSearchChange(event)}
                placeholder="Filter..."
                value={this.state.filter} />
        )
    }
}