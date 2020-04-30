import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Grid
} from '@material-ui/core';
import ContentViewer from '../../ContentViewer';
import DataProductParametersExample from '../../../assets/custom-classes/DataContext/DataProductParametersExample.json';
import DataProductOutputExample from '../../../assets/custom-classes/DataContext/DataProductOutputExample.json';
import SensorDataProductParametersExample from '../../../assets/custom-classes/DataContext/SensorDataProductContext/SensorDataProductParametersExample.json';
import SensorDataProductOutputExample from '../../../assets/custom-classes/DataContext/SensorDataProductContext/SensorDataProductOutputExample.json';
import LtifDataProductParametersExample from '../../../assets/custom-classes/DataContext/LtifDataProductContext/LtifDataProductParametersExample.json';
import LtifDataProductOutputExample from '../../../assets/custom-classes/DataContext/LtifDataProductContext/LtifDataProductOutputExample.json';

function getDataExample(id: string) {
    switch (id) {
        case 'DataProductContext':
            return {
                parameters: DataProductParametersExample,
                output: DataProductOutputExample
            }
        case 'SensorDataProductContext':
            return {
                parameters: SensorDataProductParametersExample,
                output: SensorDataProductOutputExample
            }
        case 'LtifDataProductContext':
            return {
                parameters: LtifDataProductParametersExample,
                output: LtifDataProductOutputExample
            }
        default:
            return null;
    }
}

const DataExampleParameters: React.FC = () => {
    const location = useLocation();
    const id = location.pathname
        .split('/')
        .filter(s => !!s)
        .pop() || '';

    const currentJSON = getDataExample(id);

    function renderOutput(data: any) {
        if (Array.isArray(data)) {
            return (
                <div>
                    {data.map((item, i) => {
                        return (
                            <ContentViewer
                                key={i}
                                title="Output"
                                content={item}
                                playground={true}
                                fileName={`${id}OutputSchema.jsonld`}
                                subclasses
                            />
                        )
                    })}
                </div>
            )
        } else {
            return (
                <ContentViewer
                    title="Output"
                    content={data}
                    playground={true}
                    fileName={`${id}OutputSchema.jsonld`}
                    subclasses
                />
            )
        }
    }

    if (!currentJSON) return null;

    return (
        <Grid
            container
            spacing={3}
        >
            <Grid
                item
                sm={6}
                xs={12}
            >
                <ContentViewer
                    title="Parameters"
                    content={currentJSON.parameters}
                    playground={true}
                    fileName={`${id}OutputSchema.jsonld`}
                    subclasses
                />
            </Grid>
            <Grid
                item
                sm={6}
                xs={12}
            >
                {renderOutput(currentJSON.output)}
            </Grid>
        </Grid>
    )
}

export default DataExampleParameters;