import React from 'react';
import { useLocation } from 'react-router-dom';
import ContentViewer from '../../ContentViewer';
import URI from '../../URI';
import DataProductParametersSchema from '../../../assets/custom-classes/DataContext/DataProductParametersSchema.json';
import SensorDataProductParametersSchema from '../../../assets/custom-classes/DataContext/SensorDataProductContext/SensorDataProductParametersSchema.json';
import LtifDataProductParametersSchema from '../../../assets/custom-classes/DataContext/LtifDataProductContext/LtifDataProductParametersSchema.json';

function getParametersSchemaFile(id: string) {
  switch (id) {
    case 'DataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Schema/DataProductParameters/',
            title: 'URI'
          }
        ],
        json: DataProductParametersSchema
      }
    case 'SensorDataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Schema/DataProductParameters/SensorDataProductParameters/',
            title: 'URI'
          }
        ],
        json: SensorDataProductParametersSchema
      }
    case 'LtifDataProductContext':
      return {
        uriSchema: [
          {
            uri: 'https://standards-ontotest.oftrust.net/v1/Schema/DataProductParameters/LtifDataProductParameters/',
            title: 'URI'
          }
        ],
        json: LtifDataProductParametersSchema
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

const ParametersSchema: React.FC = () => {
  const location = useLocation();
  const id = location.pathname
    .split('/')
    .filter(s => !!s)
    .pop() || '';

  const config = getParametersSchemaFile(id);

  return (
    <>
      <URI
        uri={config.uriSchema}
      />
      <ContentViewer
        content={config.json}
        playground={false}
        fileName={`${id}ParametersSchema.jsonld`}
      />
    </>
  )
}

export default ParametersSchema;