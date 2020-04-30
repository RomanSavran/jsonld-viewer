import React from 'react';
import { useLocation } from 'react-router-dom';
import ContentViewer from '../../ContentViewer';
import URI from '../../URI';
import DataProductOutputSchema from '../../../assets/custom-classes/DataContext/DataProductOutputSchema.json';
import SensorDataProductOutputSchema from '../../../assets/custom-classes/DataContext/SensorDataProductContext/SensorDataProductOutputSchema.json';
import LtifDataProductOutputSchema from '../../../assets/custom-classes/DataContext/LtifDataProductContext/LtifDataProductOutputSchema.json';

function getOutputSchemaFile(id: string) {
  switch (id) {
    case 'DataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Schema/DataProductOutput/',
            title: 'URI'
          }
        ],
        json: DataProductOutputSchema
      }
    case 'SensorDataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Schema/DataProductOutput/SensorDataProductOutput/',
            title: 'URI'
          }
        ],
        json: SensorDataProductOutputSchema
      }
    case 'LtifDataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Schema/DataProductOutput/LtifDataProductOutput/',
            title: 'URI'
          }
        ],
        json: LtifDataProductOutputSchema
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

const OutputSchema: React.FC = () => {
  const location = useLocation();
  const id = location.pathname
    .split('/')
    .filter(s => !!s)
    .pop() || '';

  const config = getOutputSchemaFile(id);

  return (
    <>
      <URI
        uri={config.uriSchema}
      />
      <ContentViewer
        content={config.json}
        playground={false}
        fileName={`${id}OutputSchema.jsonld`}
      />
    </>
  )
}

export default OutputSchema;