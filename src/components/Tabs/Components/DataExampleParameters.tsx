import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Grid
} from '@material-ui/core';
import ContentViewer from '../../ContentViewer';
import SystemAPI from '../../../services/api';
import Spinner from '../../Spinner'
import { Error404 } from '../../Errors';

function getPath(pathname: string, view: 'Parameters' | 'Output') {
    return pathname
        .split('/')
        .filter(s => (
            !['', 'v1', 'context', 'classdefinitions', 'vocabulary', 'schema', 'dataexample'].includes(s.toLowerCase())
        ))
        .map(s => {
            return s.replace('Context', view)
        })
        .join('/')
}

const DataExampleParameters: React.FC = () => {
    const [value, setValue] = useState<{
        data: null | {parameters: any, output: any},
        loading: boolean,
        error: boolean
    }>({
        data: null,
        loading: true,
        error: false
    })
    const location = useLocation();
    const parametersPath = getPath(location.pathname, 'Parameters');
    const outputPath = getPath(location.pathname, 'Output');
    const id = location.pathname
        .split('/')
        .filter(s => !!s)
        .pop() || '';

    useEffect(() => {
        let mounted = false;

        (async function () {
            try {
                const parameters = await SystemAPI.getData(`/v1/DataExample/${parametersPath}`);
                const output = await SystemAPI.getData(`/v1/DataExample/${outputPath}`);
                if (!mounted) {
                    setValue({
                        data: {
                            parameters,
                            output
                        },
                        loading: false,
                        error: false
                    })
                }
            } catch {
                setValue({
                    data: null,
                    loading: false,
                    error: true
                })
            }
        })();

        return () => {
            mounted = true;
        }
    })

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

    const { data, loading, error } = value;

    if (error) return <Error404 />
    if (loading && !error) return <Spinner />

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
                    content={data?.parameters}
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
                {renderOutput(data?.output)}
            </Grid>
        </Grid>
    )
}

export default DataExampleParameters;