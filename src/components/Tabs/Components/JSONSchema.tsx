import React, { useState, useEffect } from 'react';
import SystemAPI from '../../../services/api';
import Spinner from '../../Spinner';
import { Error404 } from '../../Errors';
import ContentViewer from '../../ContentViewer';
import { useLocation } from 'react-router-dom';
import URI from '../../URI';

const JSONSchema: React.FC = () => {
    const [value, setValue] = useState({
        data: {},
        loading: true,
        error: false
    });
    const location = useLocation();
    const path: string = location.pathname;
    const id: string = path
        .split('/')
        .filter(s => !!s)
        .pop() || '';
    const mainPath = path.split('Schema').pop() || '';

    useEffect(() => {
        let mounted = false;

        SystemAPI.getData(`/v2/Schema${mainPath}`)
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

        return () => {
            mounted = true;
        }
        /* eslint-disable-next-line */
    }, []);

    if (value.error) return <Error404 />
    if (value.loading && !value.error) return <Spinner />

    const uri = [{
        uri: window.location.href,
        title: 'URI'
    }];

    return (
        <>
            <URI 
                uri={uri}
            />
            <ContentViewer
                content={value.data}
                playground={false}
                fileName={`JSONSchema-${id}`}
            />
        </>
    )
}

export default JSONSchema;