import React from 'react';
import {SizeConsumer} from '../../services/state';

const withGlobalState = (Component) => {
    return props => {
        return (
            <SizeConsumer>
                {value => <Component {...props} value={value}/>}
            </SizeConsumer>
        )
    }
}

export default withGlobalState;