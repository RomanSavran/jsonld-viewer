import React from 'react';
import { useLocation } from 'react-router-dom';
import ContentViewer from '../../ContentViewer';
import URI from '../../URI';
import DataProductOutputContext from '../../../assets/custom-classes/DataContext/DataProductOutputContext.json';
import SensorDataProductOutputContext from '../../../assets/custom-classes/DataContext/SensorDataProductContext/SensorDataProductOutputContext.json';
import LtifDataProductOutputContext from '../../../assets/custom-classes/DataContext/LtifDataProductContext/LtifDataProductOutputContext.json';

function getOutputContextFile(id: string) {
  switch (id) {
    case 'DataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Context/DataProductOutput/',
            title: 'URI'
          }
        ],
        json: DataProductOutputContext
      }
    case 'SensorDataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Context/DataProductOutput/SensorDataProductOutput/',
            title: 'URI'
          }
        ],
        json: SensorDataProductOutputContext
      }
    case 'LtifDataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Context/DataProductOutput/LtifDataProductOutput/',
            title: 'URI'
          }
        ],
        json: LtifDataProductOutputContext
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

const OutputContext: React.FC = () => {
  const location = useLocation();
  const id = location.pathname
    .split('/')
    .filter(s => !!s)
    .pop() || '';

  const config = getOutputContextFile(id);

  return (
    <>
      <URI
        uri={config.uriSchema}
      />
      <ContentViewer
        content={config.json}
        playground={false}
        fileName={`${id}OutputContext.jsonld`}
      />
    </>
  )
}

export default OutputContext;