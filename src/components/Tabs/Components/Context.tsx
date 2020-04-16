import React, { useState, useEffect } from 'react';
import Spinner from '../../Spinner';
import SystemAPI from '../../../services/api';
import MainTab from './MainTab';
import mdFileCV from '../../../assets/context.md';
import sizeof from 'object-sizeof';
import { Error404 } from '../../Errors';
import {getMainDataByContent} from '../../../utils/helpers';
import DataContext from '../../../assets/custom-classes/DataContext/Context.json';
import SensorDataProductContext from '../../../assets/custom-classes/DataContext/SensorDataProductContext/Context.json';
import LtifDataProductContext from '../../../assets/custom-classes/DataContext/LtifDataProductContext/Context.json';

type ContextProps = {
    path: string
}

type ContextStateTypes = {
    content: any,
    size: string,
    sloc: number,
    loading: boolean,
    error: boolean
}

const Context: React.FC<ContextProps> = (props) => {
    const {
        path
    } = props;
    const [value, setValue] = useState<ContextStateTypes>({
        content: '',
        size: '',
        sloc: 0,
        loading: true,
        error: false
    });
    const [mdFile, setMDFile] = useState<string | null>(null);
    const query = `/v1/Context/${path}/`;
    const id = path.split('/').pop() || '';

    useEffect(() => {
        let mounted = false;

        if (!['DataProductContext', 'SensorDataProductContext', 'LtifDataProductContext'].includes(id)) {
            SystemAPI.getData(query)
                .then(data => {
                    if (!mounted) {
                        if (data === 404 || typeof data === 'number') {
                            setValue(prevValue => ({
                                ...prevValue,
                                error: true
                            }))
                        } else {
                            const sloc = JSON.stringify(data, undefined, 2);
                            const size = (sizeof(data) / 1000).toFixed(2);
                            setValue({
                                content: data,
                                size,
                                sloc: sloc.split('\n').length,
                                loading: false,
                                error: false
                            })
                        }
                    }
                })
        } else {
            if (id === 'DataProductContext') {
                const elements = getMainDataByContent(DataContext);
                setValue({
                    ...elements,
                    loading: false,
                    error: false
                })
            } else if (id === 'SensorDataProductContext') {
                const elements = getMainDataByContent(SensorDataProductContext);
                setValue({
                    ...elements,
                    loading: false,
                    error: false
                })
            } else if (id === 'LtifDataProductContext') {
                const elements = getMainDataByContent(LtifDataProductContext);
                setValue({
                    ...elements,
                    loading: false,
                    error: false
                })
            }
        }

        return () => {
            mounted = true;
        }

        /* eslint-disable-next-line */
    }, []);

    useEffect(() => {
        fetch(mdFileCV, {
            method: 'GET',
            headers: {
                'Cache-Control': 'public, max-age=31536000'
            }
        })
            .then(response => {
                return response.text();
            })
            .then(markdownText => {
                setMDFile(markdownText)
            })
    }, []);

    if (value.error) return <Error404 />
    if (value.loading && !value.error) return <Spinner />

    return (
        <MainTab
            uri={`https://standards-ontotest.oftrust.net${query}`}
            size={value.size}
            sloc={value.sloc}
            content={value.content}
            fileName={`Context-${id}`}
            markdown={mdFile}
        />
    )
}

export default Context;