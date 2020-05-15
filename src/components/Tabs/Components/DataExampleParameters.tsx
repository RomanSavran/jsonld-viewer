import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Grid
} from '@material-ui/core';
import ContentViewer from '../../ContentViewer';
import SystemAPI from '../../../services/api';
import Spinner from '../../Spinner'
import { Error404 } from '../../Errors';
import URI from '../../URI';

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
    const parametersPath = location.pathname.replace(/DataProductParameters|DataProductOutput/gi, 'DataProductParameters');
    const outputPath = location.pathname.replace(/DataProductParameters|DataProductOutput/gi, 'DataProductOutput');
    const id = location.pathname
        .split('/')
        .filter(s => !!s)
        .pop() || '';

    useEffect(() => {
        let mounted = false;

        (async function () {
            try {
                const parameters = await SystemAPI.getData(parametersPath);
                const output = await SystemAPI.getData(outputPath);

                if (!mounted) {
                    if (typeof parameters === 'number' || typeof output === 'number') {
                        setValue({
                          data: null,
                          loading: false,
                          error: true
                        })
                    } else {
                        setValue({
                            data: {
                                parameters,
                                output
                            },
                            loading: false,
                            error: false
                        })
                    }
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
    }, [parametersPath, outputPath])

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

    const uriList = [
        {
            uri: `${window.location.origin}${parametersPath}`,
            title: 'URI Parameters Example'
        },
        {
            uri: `${window.location.origin}${outputPath}`,
            title: 'URI Output Example'
        }
    ]

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
                xs={12}
            >
                <URI 
                    uri={uriList}
                />
            </Grid>
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