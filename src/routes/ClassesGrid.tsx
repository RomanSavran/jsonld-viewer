import React, {useState, useContext, useEffect} from 'react';
import { RoutesContext } from '../context/RoutesContext';
import { ClassItemType } from '../utils/helpers';
import Table from '../components/Table';

type ClassesGridTypes = {
	classesData: ClassItemType[]
}

const headers = [
    {id: 'id', label: '@id'},
    {id: 'type', label: '@type'},
    {id: 'subClass', label: 'subClassOf'},
    {id: 'label', label: 'Label'},
    {id: 'comment', label: 'Comment'},
    {id: 'sameAs', label: 'Same As'},
    {id: 'equivalentClass', label: 'Equivalent Class'}
]

const ClassesGrid: React.FC<ClassesGridTypes> = ({classesData}) => {
    const {handleChangeCurrentPath} = useContext(RoutesContext);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('id');

    useEffect(() => {
        handleChangeCurrentPath('classes-grid');
    }, [handleChangeCurrentPath]);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property);
    }

    return (
        <Table 
            handleRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
            data={classesData}
            headers={headers}
        />
    )
}

export default ClassesGrid;