import React, { useState, useEffect } from 'react';
import SystemAPI from '../../../services/api';
import Spinner from '../../Spinner';
import { Error404 } from '../../Errors';
import { get, has, omit } from 'lodash';
import ContentViewer from '../../ContentViewer';
import {useLocation} from 'react-router-dom';
import jsonSchemaGenerator from 'json-schema-generator';
import { Base64 } from 'js-base64';

type ResultData = {
    "@context": string
    [key: string] : {[key: string]: string} | string
}

type ContextData = {
    '@id': string,
    '@nest': string
}

const JSONSchema: React.FC= () => {
    const [value, setValue] = useState({
        data: null,
        loading: true,
        error: false
    });
    const location = useLocation();
    const path: string = location.pathname;
    const id: string = path
        .split('/')
        .filter(s => !!s)
        .pop() || '';
    
    const currentPath: string = location.pathname.split('/').filter(s => !!s).join('/');

    useEffect(() => {
        let mounted = false;

        SystemAPI.getData(`/${currentPath}`)
            .then(data => {
                if (!mounted) {
                    if (typeof data === 'number') {
                        setValue(prevValue => ({
                            ...prevValue,
                            error: true
                        }))
                    } else {
                        setValue({
                            data: JSON.parse(Base64.decode(data.content)),
                            loading: false,
                            error: false
                        })
                    }
                }
            })

        return () => {
            mounted = true;
        }
    }, [path]);

    if (value.error) return <Error404 />
    if (value.loading && !value.error) return <Spinner />

    const context: any = omit(get(value.data, '@context'), ['@version', '@vocab', '@classDefinition', 'pot']);

    const properties: { [key: string]: ContextData } = Object.keys(context)
        .filter(key => !!has(context[key], '@nest'))
        .reduce((acc, current) => ({...acc, [current]: context[current]}), {});

    const parents: {[key: string]: string} = Object.keys(context)
        .filter(key => !has(context[key], '@nest'))
        .sort()
        .reduce((acc, current) => ({...acc, [current]: ""}), {});

    const initObj: {[key: string]: string} = {
        "@context": `https://standards-ontotest.oftrust.net${path}`,
        "id": "",
        "data": "",
        "metadata": "",
        ...parents
    };

    const data: ResultData = Object.keys(properties).reduce(
        (acc: any, current) => {
            const nest: string = get(properties[current], '@nest') || '';

            acc[nest] = typeof acc[nest] === 'string' ? { [current]: "" } : Object.assign({}, acc[nest], { [current]: "" })

            return acc;
        },
        initObj
    );

    const jsonSchemaData = jsonSchemaGenerator(data)

    return (
        <ContentViewer 
            content={jsonSchemaData}
            playground={false}
            fileName={`JSONSchema-${id}`}
        />
    )
}

export default JSONSchema;