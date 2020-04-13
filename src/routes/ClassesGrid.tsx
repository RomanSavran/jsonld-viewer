import React, {useState, useContext, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { RoutesContext } from '../context/RoutesContext';
import Table from '../components/Table';

type ClassesGridTypes = {
	classesList: Array<{[key: string]: string}>
}

const headers = [
    {id: 'id', label: 'Class'},
    {id: 'subClass', label: 'Parent Class'},
    {id: 'labelEn', label: 'Label'},
    {id: 'commentEn', label: 'Description'},
]

const ClassesGrid: React.FC<ClassesGridTypes> = ({ classesList }) => {
    const {handleChangeCurrentPath, currentPath} = useContext(RoutesContext);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('id');
    const { i18n } = useTranslation();
    const language = i18n.language;

    useEffect(() => {
        if (currentPath !== 'classes-grid') {
            handleChangeCurrentPath('classes-grid');
        }
    }, [handleChangeCurrentPath, currentPath]);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property);
    }

    const headersByLang = language === 'en' ? headers : [
        {id: 'id', label: 'Class'},
        {id: 'subClass', label: 'Parent Class'},
        {id: 'labelEn', label: 'Label (en-us)'},
        {id: 'labelFi', label: 'Label (fi-fi)'},
        {id: 'commentEn', label: 'Description (en-us)'},
        {id: 'commentFi', label: 'Description (fi-fi)'}
    ]

    return (
        <Table 
            handleRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
            data={classesList}
            headers={headersByLang}
        />
    )
}

export default ClassesGrid;