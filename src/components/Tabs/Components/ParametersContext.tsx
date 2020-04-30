import React from 'react';
import { useLocation } from 'react-router-dom';
import ContentViewer from '../../ContentViewer';
import URI from '../../URI';
import DataProductParametersContext from '../../../assets/custom-classes/DataContext/DataProductParametersContext.json';
import SensorDataProductParametersContext from '../../../assets/custom-classes/DataContext/SensorDataProductContext/SensorDataProductParametersContext.json';
import LtifDataProductParametersContext from '../../../assets/custom-classes/DataContext/LtifDataProductContext/LtifDataProductParametersContext.json';

function getParametersContextFile(id: string) {
  switch(id) {
    case 'DataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Context/DataProductParameters/',
            title: 'URI'
          }
        ],
        json: DataProductParametersContext
      }
    case 'SensorDataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Context/DataProductParameters/SensorDataProductParameters/',
            title: 'URI'
          }
        ],
        json: SensorDataProductParametersContext
      }
    case 'LtifDataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Context/DataProductParameters/LtifDataProductParameters/',
            title: 'URI'
          }
        ],
        json: LtifDataProductParametersContext
      }
    default:
      return {
        uriSchema: [
          {
            uri: '',
            title: 'URI'
          }
        ],
        json: {}
      }
  }
}

const ParametersContext: React.FC = () => {
  const location = useLocation();
  const id = location.pathname
    .split('/')
    .filter(s => !!s)
    .pop() || '';

  const config = getParametersContextFile(id);

  return (
    <>
    <URI 
      uri={config.uriSchema}
    />
    <ContentViewer 
      content={config.json}
      playground={false}
      fileName={`${id}ParametersContext.jsonld`}
    />
    </>
  )
}

export default ParametersContext;