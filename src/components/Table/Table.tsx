import React, { useState } from 'react';
import {
	Table as MuiTable,
	TableHead as MuiTableHead,
	TableBody as MuiTableBody,
	TableCell as MuiTableCell,
	TableRow as MuiTableRow,
	TableSortLabel as MuiTableSortLabel,
	TextField,
	makeStyles,
	createStyles,
	Theme
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import { 
	ClassItemType, 
	PropertyItemType,
} from '../../utils/helpers';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

type Header = {
	id: string,
	label: string
}

type TableProps = {
	order: 'asc' | 'desc',
	orderBy: string,
	headers: Header[],
	data: Array<any>,
	handleRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
}

function createState(headers: Header[]): { [key: string]: string } {
	return headers.reduce((acc, current) => {
		return { ...acc, [current.id]: '' }
	}, {})
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		tableWrapper: {
			[theme.breakpoints.down('md')]: {
				overflow: 'hidden',
				overflowX: 'scroll',
				marginRight: -10
			}
		},
		table: {
			width: '100%',
			border: '1px solid rgb(124, 129, 141)'
		},
		th: {
			padding: 15,
			fontSize: 12,
			fontWeight: 600,
			fontFamily: 'Montserrat, sans-serif',
			border: 'none',
			borderRight: '1px solid rgb(224, 224, 224)',
			'&:last-child': {
				borderRight: 'none'
			}
		},
		inputTd: {
			padding: 0,
			border: '1px solid rgb(12, 118, 203)'
		},
		input: {
			width: '100%',
			height: 40,
			fontSize: 12,
			fontFamily: 'Montserrat, sans-serif',
			padding: '0 5px 0 10px',
			[theme.breakpoints.down('md')]: {
				fontSize: 16
			}
		},
		inputRoot: {
			width: '100%'
		},
		searchRoot: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		searchIcon: {
			width: 18,
			height: 18,
			color: 'rgb(124, 129, 141)',
			paddingRight: 10
		},
		textRow: {
			'&:nth-child(2n)': {
				background: 'rgb(245, 245, 245)'
			}
		},
		mainTd: {
			padding: 15,
			fontSize: 12,
			fontFamily: 'Montserrat, sans-serif',
			border: 'none',
			borderRight: '1px solid rgb(224, 224, 224)',
			'&:last-child': {
				borderRight: 'none'
			}
		},
		link: {
			color: 'rgb(0, 123, 255)',
			textDecoration: 'none',
			'&:hover': {
				textDecoration: 'underline'
			}
		}
	})
);

const Table: React.FC<TableProps> = (props) => {
	const classes = useStyles();
	const {
		order,
		orderBy,
		headers,
		data,
		handleRequestSort
	} = props;
	const {t} = useTranslation();
	const [searchProps, setSearchProps] = useState(createState(headers));

	const handleChangeSearchProps = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setSearchProps(prevProps => ({
			...prevProps,
			[name]: value
		}))
	}

	const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
		handleRequestSort(event, property);
	}

	const filterObj: { [key: string]: string } = Object.keys(searchProps)
		.filter(key => searchProps[key] !== '')
		.reduce((acc, current) => ({ ...acc, [current]: searchProps[current] }), {});

	const filterFunction = (element: ClassItemType | PropertyItemType): boolean => {
		return Object.keys(filterObj)
			.every(key =>
				_.get(element, key)
					.toLowerCase()
					.includes(filterObj[key].toLocaleLowerCase())
			);
	}

	return (
		<div className={classes.tableWrapper}>
			<MuiTable className={classes.table}>
				<MuiTableHead>
					<MuiTableRow>
						{headers.map(item => {
							return (
								<MuiTableCell
									className={classes.th}
									key={item.id}
								>
									<MuiTableSortLabel
										active={orderBy === item.id}
										direction={orderBy === item.id ? order : 'asc'}
										onClick={createSortHandler(item.id)}
									>
										{t(item.label)}
									</MuiTableSortLabel>
								</MuiTableCell>
							)
						})}
					</MuiTableRow>
				</MuiTableHead>
				<MuiTableBody>
					<MuiTableRow>
						{headers.map(item => {
							return (
								<MuiTableCell
									className={classes.inputTd}
									key={item.id}
								>
									<div className={classes.searchRoot}>
										<TextField
											className={classes.inputRoot}
											name={item.id}
											placeholder={t("Search")}
											onChange={handleChangeSearchProps}
											value={searchProps[item.id]}
											InputProps={{
												disableUnderline: true,
												className: classes.input
											}}
										/>
										<SearchIcon className={classes.searchIcon} />
									</div>
								</MuiTableCell>
							)
						})}
					</MuiTableRow>
					{
						_.chain(data)
							.filter(filterFunction)
							.orderBy([orderBy], [order])
							.map((element) => {
								return (
									<MuiTableRow
										className={classes.textRow}
										key={element.url}
									>
										{headers.map(header => {
											return (
												<MuiTableCell
													className={classes.mainTd}
													key={header.id}
												>
													{header.id === 'id' ? (
														<Link
															className={classes.link}
															to={element.url}
														>
															{_.get(element, `${header.id}`)}
														</Link>
													) : _.get(element, `${header.id}`)}
												</MuiTableCell>
											)
										})}
									</MuiTableRow>
								)
							})
							.value()
					}
				</MuiTableBody>
			</MuiTable>
		</div>
	)
}

export default Table;