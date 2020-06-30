import React, {useEffect, useContext} from 'react';
import PropertyInfo from '../components/PropertyInfo';
import {useLocation} from 'react-router-dom';
import { extractTextForGrid} from '../utils/helpers';
import { useTranslation } from 'react-i18next';
import { Error404 } from '../components/Errors';
import { RoutesContext } from '../context/RoutesContext';
import P from '../utils/platform-helper';

type PropertyDetailsTypes = {
    classesList: Array<{[key: string]: string}>,
    propData: any
}

const PropertyDetails: React.FC<PropertyDetailsTypes> = ({classesList, propData}) => {
    const {t, i18n} = useTranslation();
    const {pathname} = useLocation();
    const {handleChangeCurrentPath} = useContext(RoutesContext);

    const id = P.getId(pathname);
    const currentProperty = /Vocabulary/.test(pathname) ?  propData.find((item: any) => item.id === id) : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        handleChangeCurrentPath('properties-grid');
    }, [handleChangeCurrentPath]);
    
    if (!currentProperty) return <Error404 />

    const data = {
        id,
        superclasses: pathname.split('Vocabulary/').pop()?.split('/').filter(s => !!s && s !== id),
        comment: extractTextForGrid(currentProperty, i18n.language, 'comment') || t('Has no label'),
        label: extractTextForGrid(currentProperty, i18n.language, 'label') || t('Has no description'),
        domain: currentProperty.domain
    }
    
    return (
        <PropertyInfo 
            data={data}
            id={id}
            classesList={classesList}
        />
    )
};

export default PropertyDetails;