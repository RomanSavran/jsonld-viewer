import React from 'react'
import {useRouteMatch} from 'react-router-dom'
import ClassesDetails from './ClassesDetails'
import PropertyDetails from './PropertyDetails'
import {classesIdList} from '../utils/lists'

type DetailsProps = {
    classesList: Array<{[key: string]: string}>,
    propData: Array<{[key: string]: any}>,
    manualPathVocab: {[key: string]: string}
}

const Details: React.FC<DetailsProps> = ({
    classesList,
    propData,
    manualPathVocab
}) => {
    const match = useRouteMatch();
    const isClass = match.url
        .split('/')
        .some(s => classesIdList.includes(s));
    return isClass ? 
        <ClassesDetails 
            manualPathVocab={manualPathVocab} 
            classesList={classesList} 
            propData={propData}
        /> : 
        <PropertyDetails 
            classesList={classesList} 
            propData={propData}
        />
}

export default Details