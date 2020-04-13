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
    {id: 'labelEn', label: 'Label'},
    {id: 'commentEn', label: 'Description'},
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
            range: item.range || '',
            labelEn: extractTextForGrid(item, 'en', 'label'),
            commentEn: extractTextForGrid(item, 'en', 'comment'),
            labelFi: extractTextForGrid(item, 'fi', 'label'),
            commentFi: extractTextForGrid(item, 'fi', 'comment'),
        }
    });

    const headersByLanguage = language === 'en' ? headers : [
        {id: 'category', label: 'Property category'},
        {id: 'id', label: 'Property'},
        {id: 'labelEn', label: 'Label (en-us)'},
        {id: 'labelFi', label: 'Label (fi-fi)'},
        {id: 'commentEn', label: 'Description (en-us)'},
        {id: 'commentFi', label: 'Description (fi-fi)'},
        {id: 'domain', label: 'Domain'},
        {id: 'range', label: 'Range'}
    ];

    return (
        <Table 
            order={order}
            handleRequestSort={handleRequestSort}
            orderBy={orderBy}
            data={modifiedData}
            headers={headersByLanguage}
        />
    )
}

export default PropertiesGrid;