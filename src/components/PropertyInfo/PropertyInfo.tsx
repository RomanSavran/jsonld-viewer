import React, {useState} from 'react';
import Info from '../Info';
import Table from '../Table';
import { useTranslation } from 'react-i18next';

type PropertyInfoProp = {
    data: any,
    id: string,
    classesList: Array<{[key: string]: string}>
}

const headers: Array<{id: string, label: string}> = [
    {id: 'id', label: 'Class'},
    {id: 'subClass', label: 'Parent classes'},
    {id: 'commentEn', label: 'Description'}
]

const PropertyInfo: React.FC<PropertyInfoProp> = (props) => {
    const {
        data,
        id,
        classesList
    } = props;
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('id');
    const {i18n} = useTranslation();

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

    const headersByLanguage = i18n.language === 'en' ? headers : [
        {id: 'id', label: 'Class'},
        {id: 'subClass', label: 'Parent classes'},
        {id: 'commentEn', label: 'Description (en-us)'},
        {id: 'commentFi', label: 'Description (fi-fi)'}
    ]

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
                headers={headersByLanguage}
                handleRequestSort={handleRequestSort}
            />
        </div>
    )
}

export default PropertyInfo;