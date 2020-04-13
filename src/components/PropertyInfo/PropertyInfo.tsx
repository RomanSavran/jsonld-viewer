import React, {useState} from 'react';
import Info from '../Info';
import {ClassItemType} from '../../utils/helpers';
import Table from '../Table';

type PropertyInfoProp = {
    data: any,
    id: string,
    classesList: Array<{[key: string]: string}>
}

const headers: Array<{id: string, label: string}> = [
    {id: 'id', label: 'class'},
    {id: 'subClass', label: 'Parent classes'},
    {id: 'comment', label: 'Description'}
]

const PropertyInfo: React.FC<PropertyInfoProp> = (props) => {
    const {
        data,
        id,
        classesList
    } = props;
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('id');

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property);
    }
    const {
        label,
        comment,
        superclasses,
        domain
    } = data;
    const propLink: string = [...superclasses, id].join('/');
    const uri: string = `https://standards-ontotest.oftrust.net/v1/Vocabulary/${propLink}`;
    const currentClasses: Array<{[key: string]: string}> = classesList.filter(cls => {
        return domain.some((domainItem: {url: string, label: string}) => {
            return domainItem.label === cls.id
        })
    });

    return (
        <div>
            <Info 
                label={label}
                comment={comment}
                id={id}
                superclasses={superclasses}
                isOnlyVocabulary={false}
                uri={uri}
                type="prop"
            />
            <Table 
                order={order}
                orderBy={orderBy}
                data={currentClasses}
                headers={headers}
                handleRequestSort={handleRequestSort}
            />
        </div>
    )
}

export default PropertyInfo;