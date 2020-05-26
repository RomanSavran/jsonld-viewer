import React, { useContext } from 'react';
import {
  makeStyles,
  Theme
} from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import TreeNode from './TreeNode';
import {RoutesContext} from '../../context/RoutesContext';
import clsx from 'clsx';
import P from '../../utils/platform-helper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme: Theme) => ({
  li: {
    position: 'relative',
    paddingLeft: 10,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '3px 0',
    cursor: 'pointer',
    '& > .active': {
      color: 'rgb(194,178,255)'
    },
  },
  link: {
    paddingLeft: 5,
    fontSize: 12,
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
    color: '#FFF',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  squareWrapper: {
    position: 'absolute',
    left: -5,
  },
  chevron: {
    width: 18,
    height: 18,
    color: '#fff'
  },
  chevronOpen: {
    transform: 'rotate(180deg)'
  }
}))

interface TreeNodeElementProps {
  filter: string,
  node: any,
  tree: any
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

  const id: string = P.getId(node.path);
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
            className={classes.link}
            isActive={(match, location) => {
              return P.getId(location.pathname) === id;
            }}
          >
            {node.id}
          </NavLink>
          {
            node.children.length && !filter ? (
              <KeyboardArrowDownIcon className={clsx(classes.chevron, {
                [classes.chevronOpen]: isExpand
              })}/>
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