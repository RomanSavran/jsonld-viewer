import React, { useContext, MouseEvent } from 'react';
import {
	makeStyles,
	createStyles,
	Theme
} from '@material-ui/core';
import { RoutesContext } from '../../context/RoutesContext';
import TreeNode from './TreeNode';
import { NavLink } from 'react-router-dom';
import { NodeType } from '../../utils/helpers';
import clsx from 'clsx';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		ulRoot: {
			margin: 0,
			marginTop: 20,
			padding: 0,
			listStyle: 'none',
			'& > li > ul': {
				paddingLeft: 31
			},
			[theme.breakpoints.down('md')]: {
				overflow: 'hidden',
				overflowX: 'scroll'
			}
		},
		li: {
			position: 'relative',
		},
		square: {
			cursor: 'pointer'
		},
		link: {
			paddingLeft: 5,
			fontSize: 12,
			fontFamily: 'Montserrat, sans-serif',
			fontWeight: 400,
			color: '#fff',
			textDecoration: 'none',
			textTransform: 'uppercase',
			'&:hover': {
				textDecoration: 'underline',
			}
		},
		strokeWrapper: {
			display: 'flex',
			alignItems: 'center',
			cursor: 'pointer',
			'& > .active': {
				color: 'rgb(194,178,255)'
			},
		},
		chevron: {
			color: '#fff'
		},
		chevronOpen: {
			transform: 'rotate(180deg)'
		}
	})
)

type TreeTypes = {
	rootNodes: NodeType[],
	tree: any,
	filter: string
}

const Tree: React.FC<TreeTypes> = ({
	rootNodes,
	tree,
	filter
}) => {
	const classes = useStyles();
	const { treeState, handleChangeTreeState } = useContext(RoutesContext);

	const handleChangeParentStatus = (nodePath: string, status: boolean) => (event: MouseEvent<HTMLSpanElement>) => {
		handleChangeTreeState(nodePath, status)
	};

	return (
		<ul className={classes.ulRoot}>
			{rootNodes.map((node: NodeType, idx) => {
				const id: string = node.path
					.split('/')
					.filter((s: string) => !!s)
					.pop() || '';
				const isExpand = id in treeState ? treeState[id] : false;
				return (
					<li className={classes.li} key={node.id}>
						<div className={classes.strokeWrapper} onClick={handleChangeParentStatus(node.id, !isExpand)}>
							<span
								className={classes.square}
							>
								<KeyboardArrowDownIcon 
									className={clsx(classes.chevron, {
										[classes.chevronOpen]: isExpand
									})}
								/>
							</span>
							<NavLink className={classes.link} to={node.path} exact>{id}</NavLink>
						</div>
						{
							isExpand || !!filter ? (
								<TreeNode
									withBorder={true}
									filter={filter}
									node={node}
									tree={tree}
								/>
							) : null
						}
					</li>
				)
			})}
		</ul>
	)
}

export default React.memo(Tree);