import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {withStyles} from '@material-ui/core/styles';

const stylesTab = theme => ({
    root: {
        'minWidth': 'auto',
        'textTransform': 'none',
        'padding': '15px 25px',
        'color': '#4C4C51',
        'transition': 'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        [theme.breakpoints.down('xs')]: {
            'padding': '10px'
        }
    },
    wrapper: {
        'position': 'relative',
        'zIndex': '999',
        'fontSize': '12px',
        'fontWeight': '600',
        'lineHeight': '12px',
        'fontFamily': 'Montserrat'
    },
    selected: {
        'color': '#fff',
        [theme.breakpoints.down('xs')]: {
            'background': '#0095FF',
            'transition': 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            'outline': 'none'
        }
    }
});

const stylesTabs = theme => ({
    root: {
        'borderBottom': '2px solid #0095ff',
        [theme.breakpoints.down('xs')]: {
            'border': 'none'
        }
    },
    indicator: {
        height: '100%',
        background: '#0095FF',
        [theme.breakpoints.down('xs')]: {
            'display': 'none'
        }
    },
    flexContainer: {
        [theme.breakpoints.down('xs')]: {
            'display': 'flex',
            'flexWrap': 'wrap'
        }
    }
})

const StyledTab = withStyles(stylesTab)(Tab);
const StyledTabs = withStyles(stylesTabs)(Tabs);

class RouterTabs extends Component {

    state = {
        value: 0
    }

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        })
    }

    render() {
        const {value} = this.state;
        const {children, tabView} = this.props;

        return (
            <>
                <StyledTabs
                    value={value}
                    onChange={this.handleChange}>
                        {
                            tabView.map(tab => {
                                return <StyledTab key={tab} label={tab}/>
                            })
                        }
                </StyledTabs>
                <div className="item-wrapper" key="tab-content">
                    {
                        React.Children.toArray(children).filter((child, idx) => idx === value)
                    }
                    
                </div>
            </>
        )
    }
}

export default RouterTabs;