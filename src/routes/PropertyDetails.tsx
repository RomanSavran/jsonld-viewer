import React from 'react';
import PropertyInfo from '../components/PropertyInfo';
import {useLocation} from 'react-router-dom';
import {ClassItemType, extractTextForGrid} from '../utils/helpers';
import { useTranslation } from 'react-i18next';
import { Error404 } from '../components/Errors';

type PropertyDetailsTypes = {
    classesData: ClassItemType[],
    propData: any
}

const PropertyDetails: React.FC<PropertyDetailsTypes> = ({classesData, propData}) => {
    const {t, i18n} = useTranslation();
    const location = useLocation();
    const id: string = location.pathname.split('/').pop() || '';
    const currentProperty = propData.find((item: any) => item.id === id);
    
    if (!currentProperty) return <Error404 />

    const data = {
        id,
        superclasses: location.pathname.split('Vocabulary/').pop()?.split('/').filter(s => !!s && s !== id),
        comment: extractTextForGrid(currentProperty, i18n.language, 'comment') || t('Has no label'),
        label: extractTextForGrid(currentProperty, i18n.language, 'label') || t('Has no description'),
        domain: currentProperty.domain || []
    }
    
    return (
        <PropertyInfo 
            data={data}
            id={id}
            classesData={classesData}
        />
    )
};

export default PropertyDetails;