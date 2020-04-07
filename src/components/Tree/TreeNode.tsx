import React from 'react';
import {
	makeStyles
} from '@material-ui/core';
import { Expand } from '../Icons';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { NodeType, getChildNodes } from '../../utils/helpers';

const useStyles = makeStyles(theme => ({
	ul: {
		margin: 0,
		paddingLeft: 20,
		listStyle: 'none'
	},
	filteredUl: {
		paddingLeft: 0
	},
	li: {
		position: 'relative',
		'&::before': {
			content: "''",
			position: 'absolute',
			left: 0,
			top: -5,
			width: 1,
			height: '100%',
			background: 'rgb(164, 165, 167)'
		},
		'&:last-child': {
			'&::before': {
				height: 15
			}
		}
	},
	filteredLi: {
		'&::before': {
			top: -11
		},
		'&:last-child': {
			'&::before': {
				height: '100%'
			}
		}
	},
	strokeWrapper: {
		display: 'flex',
		flexDirection: 'row-reverse',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: '3px 0',
		'& > .active': {
			color: 'rgb(0, 149, 255)'
		},
		'& > .active + svg': {
			fill: 'rgb(0, 149, 255)'
		}
	},
	link: {
		paddingLeft: 5,
		fontSize: 12,
		fontFamily: 'Montserrat, sans-serif',
		fontWeight: 400,
		color: 'rgb(49, 49, 49)',
		textDecoration: 'none',
		'&:hover': {
			color: 'rgb(0, 86, 179)',
			textDecoration: 'underline'
		}
	}
}))

type TreeNodeType = {
	node: NodeType,
	filter: string,
	tree: any
}

const TreeNode: React.FC<TreeNodeType> = (props) => {
	const classes = useStyles();
	const { node, filter, tree } = props;

	return (
		<ul
			className={clsx(classes.ul, {
				[classes.filteredUl]: !!filter
			})}
		>
			{getChildNodes(tree, node).map((childNode: NodeType) => {
				const text: string = childNode.path
					.split('/')
					.filter(s => !!s)
					.pop() || '';
				return (
					<li
						className={clsx(classes.li, {
							[classes.filteredLi]: !!filter
						})}
						key={childNode.path}
					>
						{text.toLowerCase().includes(filter) ? (
							<div className={classes.strokeWrapper}>
								<NavLink
									to={childNode.path}
									exact
									className={classes.link}
								>
									{text}
								</NavLink>
								<Expand
									width={26}
									height={14}
									viewBox="0 0 26 14"
									htmlColor="rgb(164, 165, 167)"
								/>
							</div>
						) : null}
						<TreeNode
							node={childNode}
							filter={filter}
							tree={tree}
						/>
					</li>
				)
			})}
		</ul>
	)
}

export default React.memo(TreeNode);