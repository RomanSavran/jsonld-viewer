import React, {PureComponent} from 'react';
import {debounce} from 'lodash';

const {Provider: SizeProvider, Consumer: SizeConsumer} = React.createContext();

class WindowProvider extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth,
            prevURL: null,
            setPrevURL: this.setPrevURL,
            toggleNavView: this.toggleNavView,
            closeNavView: this.closeNavView,
            showMobileNav: false
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    updateDimensions = debounce(e => {
        this.setState({
            width: window.innerWidth
        })
    }, 400);

    setPrevURL = (url) => {
        const urlArray = url.split('/');
        this.setState({
            prevURL: urlArray[urlArray.length - 1]
        })
    }

    toggleNavView = () => {
        this.setState(state => {
            return {
                showMobileNav: !state.showMobileNav
            }
        })
    }

    closeNavView = () => {
        this.setState({
            showMobileNav: false
        })
    }

    render() {
        return (
            <SizeProvider value={this.state}>
                {this.props.children}
            </SizeProvider>
        ) 
    }
}

export {
    WindowProvider,
    SizeConsumer
}