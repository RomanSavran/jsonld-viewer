import React, {PureComponent} from 'react'
import {cloneDeep} from 'lodash';
import SearchField from '../search-field';
import PageTitle from '../page-title';
import * as TreeConstructor from '../../services/tree-builder';
import {createListData, search} from '../../services/utils';
import './tree.scss';

export default class Tree extends PureComponent {
    state = {
        fiter: '',
        tree: [],
        parentStatus: {}
    }

    componentDidMount() {
        this.installTree();
    }

    searchHandler = (filter) => {
        this.setState({ filter })
    }

    installTree = () => {
        const tree = TreeConstructor.buildClasses(this.props.data);
        const parentStatus = createListData(tree.length);
        this.setState({tree, parentStatus});
    } 

    onParentStatusHandler = (id) => {
        this.setState(({parentStatus}) => {
            return {
                parentStatus: {...parentStatus, [id]: !parentStatus[id]}
            }
        })
    }

    render() {
        const {state: {tree, parentStatus, filter}, onParentStatusHandler} = this;
        const filteredTree = search(cloneDeep(tree), filter);
        const elements = TreeConstructor.render(filteredTree, '/v1/Context', parentStatus, onParentStatusHandler);

        return (
            <>
                <PageTitle text="Class higherarchy"/>
                <SearchField searchHandler={this.searchHandler}/>
                <ul className="tree">
                    {elements}
                </ul>
            </>
        )
    }
}