import React, { useContext } from 'react';
import {
  makeStyles,
  Theme
} from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import TreeNode from './TreeNode';
import { Expand, MinusSquare, PlusSquare } from '../Icons';
import {RoutesContext} from '../../context/RoutesContext';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
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
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '3px 0',
    cursor: 'pointer',
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
  },
  squareWrapper: {
    position: 'absolute',
    left: -5,
  }
}))

interface TreeNodeElementProps {
  filter: string,
  node: any,
  tree: any
}

const squareProps = {
  htmlColor: "rgb(0, 149, 255)",
  color: "action",
  width: '12',
  height: '12',
}

const TreeNodeElement: React.FC<TreeNodeElementProps> = ({
  node,
  filter,
  tree
}) => {
  const classes = useStyles();
  const {treeState, handleChangeTreeState} = useContext(RoutesContext);

  const changeExpandStatus = (nodePath: string, status: boolean) => (event: React.MouseEvent<unknown>) => {
    handleChangeTreeState(nodePath, status)
  }

  const id: string = node.path
    .split('/')
    .filter((s: string) => !!s)
    .pop() || '';

  const isExpand = id in treeState ? treeState[id] : false;

  return (
    <li
      className={clsx(classes.li, {
        [classes.filteredLi]: !!filter
      })}
    >
      {id.toLowerCase().includes(filter) ? (
        <div className={classes.strokeWrapper} onClick={changeExpandStatus(node.path, !isExpand)}>
          <NavLink
            to={node.path}
            exact
            className={classes.link}
          >
            {id}
          </NavLink>
          <Expand

            width={26}
            height={14}
            viewBox="0 0 26 14"
            htmlColor="rgb(164, 165, 167)"
          />
          {
            node.children.length && !filter ? (
              <span  className={classes.squareWrapper}>{
                isExpand ? <MinusSquare {...squareProps} /> : <PlusSquare {...squareProps} />
              }</span>
            ) : null
          }
        </div>
      ) : null}
      {
        isExpand || !!filter ? (
          <TreeNode
            node={node}
            filter={filter}
            tree={tree}
          />
        ) : null
      }
    </li>
  )
}

export default React.memo(TreeNodeElement);