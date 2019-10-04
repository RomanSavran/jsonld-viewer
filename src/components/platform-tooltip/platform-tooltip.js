import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PropTypes from 'prop-types';

export default class PlatformTooltip extends Component {

    static propTypes = {
        copyText: PropTypes.string.isRequired
    }

    state = {
        copied: false
    }

    handleTooltipOpen = () => {
        this.setState({
            copied: true
        })
    }

    handleTooltipClose = () => {
        this.setState({
            copied: false
        })
    }

    render() {
        const { copied } = this.state;
        const { copyText } = this.props;

        return (
            <ClickAwayListener onClickAway={this.handleTooltipClose}>
                <div>
                    <Tooltip
                        placement="right"
                        interactive
                        leaveDelay={1000}
                        PopperProps={{
                            disablePortal: true,
                        }}
                        onClose={this.handleTooltipClose}
                        open={copied}
                        title="Copied"
                    >
                        <CopyToClipboard text={copyText} onCopy={this.handleTooltipOpen}>
                            <span className="copy">
                                <i className="far fa-copy"></i>
                            </span>
                        </CopyToClipboard>
                    </Tooltip>
                </div>
            </ClickAwayListener>
        )
    }
}