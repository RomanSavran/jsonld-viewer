import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {getFromStorage, addToStorage} from '../../services/utils';
import Collapse from '@material-ui/core/Collapse';
import Markdown from 'react-markdown'
import Spinner from '../spinner';
import download from 'downloadjs';
import PlatformTooltip from '../platform-tooltip';

export default class MainTab extends PureComponent {
    static propTypes = {
        data: PropTypes.object.isRequired,
        mdFileSrc: PropTypes.string.isRequired
    }

    state = {
        showDetails: true,
        markdownText: getFromStorage(this.props.mdFileSrc) || null
    }

    componentDidMount() {
        const {markdownText} = this.state;

        if (!markdownText) {
            this.fetchMDFile()
        }
    }

    fetchMDFile = () => {
        const {mdFileSrc} = this.props;
        fetch(mdFileSrc)
            .then(response => {
                return response.text()
            })
            .then(markdownText => {
                this.setState({
                    markdownText
                }, _ => {
                    addToStorage(mdFileSrc, markdownText)
                })
            })
    }

    onToggleHandler = () => {
        this.setState(state => {
            return {
                showDetails: !state.showDetails
            }
        })
    }

    downloadFile(data) {
        const downloadData = JSON.stringify(data, undefined, 2);

        download(downloadData, `${this.props.fileName}.json`, 'application/json');
    }

    render() {
        const {markdownText, showDetails} = this.state
        const {data: {content, size, sloc}} = this.props;
        const url = this.props.data.url || `https://standards.oftrust.net${window.location.pathname}`;

        const iconStyle = {
            'transform': `rotate(${showDetails ? 0 : 180}deg)`
        }

        if (!markdownText) {
            return <Spinner />
        }

        return (
            <div className="main-tabs-details">
                <div className="item-description">
                    <div className="copy-block">
                        <h4 className="item-description__title">URI</h4>
                        <PlatformTooltip copyText={url}/>
                    </div>
                    <a className="item-description__body item-description__body--link" href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </div>
                <div className="class-definition-header">
                    <h3>Implementation</h3>
                    <span className="chevron-down" style={iconStyle} onClick={this.onToggleHandler}>
                        <i className="fas fa-chevron-down"></i>
                    </span>
                </div>
                <div className="class-definition-body">
                    <div className="class-definition-top">
                        <div className="left">
                            <span className="number-of-lines">{sloc} lines ({sloc} sloc)</span> |
                            {" "}
                            <span className="file-size">{`${size} KB`}</span>
                        </div>
                        <div className="right">
                            <span className="download-btn" onClick={() => this.downloadFile(content)}> Download </span>
                        </div>
                    </div>
                    <Collapse in={showDetails} timeout={350}>
                        <pre >{JSON.stringify(content, undefined, '\t')}</pre>
                    </Collapse>
                </div>
                <div className="markdown">
                    <Markdown source={markdownText}/>
                </div>
            </div>
        )
    }
}