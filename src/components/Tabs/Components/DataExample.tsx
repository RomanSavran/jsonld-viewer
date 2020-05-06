import React, { useState, useEffect } from 'react';
import SystemAPI from '../../../services/api';
import Spinner from '../../Spinner';
import { Error404 } from '../../Errors';
import ContentViewer from '../../ContentViewer';

type ResultData = {
    "@context": string
    [key: string] : {[key: string]: string} | string
}

type ContextData = {
    '@id': string,
    '@nest': string
}

type DataExampleProps = {
    path: string
}

const DataExample: React.FC<DataExampleProps> = (props) => {
    const {
        path
    } = props;
    const [value, setValue] = useState({
        data: {},
        loading: true,
        error: false
    });
    const id: string = path
        .split('/')
        .filter(s => !!s)
        .pop() || '';

    useEffect(() => {
        let mounted = false;

        if (!['DataProductContext', 'SensorDataProductContext', 'LtifDataProductContext'].includes(id)) {
            SystemAPI.getData(path)
                .then(data => {
                    if (!mounted) {
                        if (typeof data === 'number') {
                            setValue(prevValue => ({
                                ...prevValue,
                                error: true
                            }))
                        } else {
                            setValue({
                                data,
                                loading: false,
                                error: false
                            })
                        }
                    }
                })
        } else {
            setValue({
                data: {},
                loading: false,
                error: false
            })
        }

        return () => {
            mounted = true;
        }
    }, [path, id]);

    const {error, loading, data} = value;

    if (error) return <Error404 />
    if (loading && !error) return <Spinner />

    return (
        <ContentViewer 
            content={data}
            playground={true}
            fileName={`${id}DataExample.json`}
        />
    )
}

export default DataExample;