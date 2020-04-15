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
		paddingLeft: 20,
		listStyle: 'none'
	},
	filteredUl: {
		paddingLeft: 0
	}
}))

type TreeNodeType = {
	node: NodeType,
	filter: string,
	tree: any
}

const TreeNode: React.FC<TreeNodeType> = ({
	node,
	filter,
	tree
}) => {
	const classes = useStyles();

	return (
		<ul
			className={clsx(classes.ul, {
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