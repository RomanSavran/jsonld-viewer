import React, {useContext, useEffect, useState} from 'react';
import { RoutesContext } from '../context/RoutesContext';
import { PropertyItemType, extractTextForGrid } from '../utils/helpers';
import { useTranslation } from 'react-i18next';
import Table from '../components/Table';

type PropertiesGridTypes = {
	propertiesData: PropertyItemType[]
}

const headers = [
    {id: 'id', label: '@id'},
    {id: 'category', label: 'Category'},
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

    const modifiedData = propertiesData.map((item: PropertyItemType) => {
        return {
            ...item,
            label: extractTextForGrid(item, language, 'label'),
            comment: extractTextForGrid(item, language, 'comment'),
            domain: item.domain ? item.domain.join(', ') : ''
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