import React, { useState, useEffect } from 'react';
import Spinner from '../../Spinner';
import SystemAPI from '../../../services/api';
import MainTab from './MainTab';
import mdFileCV from '../../../assets/context.md';
import sizeof from 'object-sizeof';
import { Error404 } from '../../Errors';
import { Base64 } from 'js-base64';

type VocabularyProps = {
    path: string
}

type VocabularyStateTypes = {
    content: any,
    size: string,
    sloc: number,
    loading: boolean,
    error: boolean
}

const Vocabulary: React.FC<VocabularyProps> = (props) => {
    const {
        path
    } = props;
    const [value, setValue] = useState<VocabularyStateTypes>({
        content: '',
        size: '',
        sloc: 0,
        loading: true,
        error: false
    });
    const [mdFile, setMDFile] = useState<string | null>(null);
    const id = path.split('/').pop();
    
    useEffect(() => {
        let mounted = false;

        SystemAPI.getData(path)
            .then(data => {
                if (!mounted) {
                    if (data === 404 || typeof data === 'number') {
                        setValue(prevValue => ({
                            ...prevValue,
                            error: true
                        }))
                    } else {
                        const currentData = JSON.parse(Base64.decode(data.content));
                        const sloc = JSON.stringify(currentData, undefined, 2);
                        const size = (sizeof(currentData) / 1000).toFixed(2);
                        setValue({
                            content: currentData,
                            size,
                            sloc: sloc.split('\n').length,
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

    useEffect(() => {
        fetch(mdFileCV)
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
            uri={`https://standards-ontotest.oftrust.net${path}`}
            size={value.size}
            sloc={value.sloc}
            content={value.content}
            fileName={`Vocabulary-${id}`}
            markdown={mdFile}
        />
    )
}

export default Vocabulary;