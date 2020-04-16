import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
	Tooltip,
	ClickAwayListener,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type CopyTooltipTypes = {
	copyText: string,
	children: React.ReactElement,
	placement: 'bottom' | 'bottom-end' | 'bottom-start' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top'
}

const CopyTooltip: React.FC<CopyTooltipTypes> = (props) => {
	const {
		copyText,
		children,
		placement
	} = props;
	const [copied, setCopied] = useState(false);
	const {t} = useTranslation();

	const handleTooltipOpen = () => {
		setCopied(true);
	}

	const handleTooltipClose = () => {
		setCopied(false);
	}

	const title = t("Copied");

	return (
		<ClickAwayListener
			onClickAway={handleTooltipClose}
		>
			<Tooltip
				placement={placement}
				interactive
				leaveDelay={1000}
				PopperProps={{
					disablePortal: true
				}}
				onClose={handleTooltipClose}
				open={copied}
				title={title}
			>
				<CopyToClipboard
					text={copyText}
					onCopy={handleTooltipOpen}
				>
					{children}
				</CopyToClipboard>
			</Tooltip>
		</ClickAwayListener>
	)
}

export default CopyTooltip;