import React, {useContext, useEffect, useState} from 'react';
import { RoutesContext } from '../context/RoutesContext';
import { extractTextForGrid } from '../utils/helpers';
import { useTranslation } from 'react-i18next';
import Table from '../components/Table';

type PropertiesGridTypes = {
	propertiesData: Array<{[key: string]: any}>
}

const headers = [
    {id: 'category', label: 'Property category'},
    {id: 'id', label: 'Property'},
    {id: 'label', label: 'Label'},
    {id: 'comment', label: 'Comment'},
    {id: 'domain', label: 'Domain'},
    {id: 'range', label: 'Range'}
];

const PropertiesGrid: React.FC<PropertiesGridTypes> = ({propertiesData}) => {
    const {i18n} = useTranslation();
    const language = i18n.language;
    const {handleChangeCurrentPath} = useContext(RoutesContext);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('category');

    useEffect(() => {
        handleChangeCurrentPath('properties-grid');
    }, [handleChangeCurrentPath]);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property);
    }

    const modifiedData = propertiesData.map(item => {
        return {
            ...item,
            label: extractTextForGrid(item, language, 'label'),
            comment: extractTextForGrid(item, language, 'comment'),
        }
    });

    return (
        <Table 
            order={order}
            handleRequestSort={handleRequestSort}
            orderBy={orderBy}
            data={modifiedData}
            headers={headers}
        />
    )
}

export default PropertiesGrid;