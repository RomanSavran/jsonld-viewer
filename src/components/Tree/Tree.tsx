import React, { useContext, MouseEvent } from 'react';
import {
	makeStyles,
	createStyles,
	Theme
} from '@material-ui/core';
import {
	PlusSquare,
	MinusSquare,
	Folder
} from '../Icons';
import { RoutesContext } from '../../context/RoutesContext';
import TreeNode from './TreeNode';
import { NavLink } from 'react-router-dom';
import { NodeType } from '../../utils/helpers';

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
			'&::before': {
				content: "''",
				position: 'absolute',
				top: 15,
				left: 5,
				width: 1,
				height: 'calc(100% - 11px)',
				background: 'rgb(164, 165, 167)'
			},
			'&:last-child': {
				'&::before': {
					display: 'none'
				}
			},
		},
		square: {
			cursor: 'pointer'
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
				textDecoration: 'underline',
			}
		},
		strokeWrapper: {
			cursor: 'pointer',
			'& > .active': {
				color: 'rgb(0, 149, 255)'
			},
		}
	})
)

const squareProps = {
	htmlColor: "rgb(0, 149, 255)",
	color: "action",
	width: '12',
	height: '12',
}

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
			{rootNodes.map((node: NodeType) => {
				const id: string = node.path
					.split('/')
					.filter((s: string) => !!s)
					.pop() || '';
				const isExpand = id in treeState ? treeState[id] : false;
				return (
					<li className={classes.li} key={node.path}>
						<div className={classes.strokeWrapper} onClick={handleChangeParentStatus(node.path, !isExpand)}>
							<span
								className={classes.square}
							>
								{isExpand ? <MinusSquare {...squareProps} /> : <PlusSquare {...squareProps} />}
							</span>
							<span>
								<Folder
									width={27}
									height={12}
									viewBox="0 0 27 12"
									htmlColor="rgb(164, 165, 167)"
								/>
							</span>
							<NavLink className={classes.link} to={node.path} exact>{id}</NavLink>
						</div>
						{
							isExpand || !!filter ? (
								<TreeNode
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