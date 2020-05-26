import React from 'react';
import {
	makeStyles
} from '@material-ui/core';
import clsx from 'clsx';
import { NodeType, getChildNodes } from '../../utils/helpers';
import TreeNodeElement from './TreeNodeElement';

const useStyles = makeStyles(theme => ({
	ul: {
		margin: 0,
		paddingLeft: 10,
		listStyle: 'none',
	},
	border: {
		position: 'relative',
		'&::before': {
			content: "''",
			position: 'absolute',
			width: 2,
			height: '100%',
			background: '#7955ff'
		}
	},
	filteredUl: {
		paddingLeft: 0
	}
}))

type TreeNodeType = {
	node: NodeType,
	filter: string,
	tree: any,
	withBorder?: boolean
}

const TreeNode: React.FC<TreeNodeType> = ({
	node,
	filter,
	tree,
	withBorder
}) => {
	const classes = useStyles();
	return (
		<ul
			className={clsx(classes.ul, withBorder ? classes.border : null, {
				[classes.filteredUl]: !!filter
			})}
		>
			{getChildNodes(tree, node).map((childNode: NodeType) => {
				return (
					<TreeNodeElement 
						key={childNode.path}
						node={childNode}
						filter={filter}
						tree={tree}
					/>
				)
			})}
		</ul>
	)
}

export default React.memo(TreeNode);