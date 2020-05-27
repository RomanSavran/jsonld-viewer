import React, { useState, useEffect } from 'react';
import Spinner from '../../Spinner';
import SystemAPI from '../../../services/api';
import mdFileCD from '../../../assets/ClassdefinitionOverview.md';
import { Error404 } from '../../Errors';
import URI from '../../URI';
import MarkdownPT from '../../Markdown';
import ContentViewer from '../../ContentViewer';

type ClassDefinitionProps = {
    path: string
}

type ClassDefinitionStateTypes = {
    content: any,
    loading: boolean,
    error: boolean
}

const ClassDefinition: React.FC<ClassDefinitionProps> = (props) => {
    const {
        path
    } = props;
    const [value, setValue] = useState<ClassDefinitionStateTypes>({
        content: '',
        loading: true,
        error: false
    });
    const [mdFile, setMDFile] = useState<string | null>(null);
    const id = path.split('/').pop() || '';

    useEffect(() => {
        let mounted = false;

        if (!['DataProductContext', 'SensorDataProductContext', 'LtifDataProductContext'].includes(id)) {
            SystemAPI.getData(path)
                .then(data => {
                    if (!mounted) {
                        if (data === 404 || typeof data === 'number') {
                            setValue(prevValue => ({
                                ...prevValue,
                                error: true
                            }))
                        } else {
                            setValue({
                                content: data,
                                loading: false,
                                error: false
                            })
                        }
                    }
                })
        } else {
            setValue({
                content: {},
                loading: false,
                error: false
            })
        }
        
        return () => {
            mounted = true;
        }

        /* eslint-disable-next-line */
    }, []);

    useEffect(() => {
        fetch(mdFileCD)
            .then(response => {
                return response.text();
            })
            .then(markdownText => {
                setMDFile(markdownText)
            })
    }, []);

    if (value.error) return <Error404 />
    if (value.loading && !value.error) return <Spinner />

    const {content} = value;

    return (
        <div>
			<URI 
				uri={[{
                    uri: window.location.href,
                    title: 'URI'
                }]}
			/>
			<ContentViewer
				content={content}
				fileName={`ClassDefinitions-${id}`}
			/>
			<MarkdownPT 
				source={mdFile}
			/>
		</div>
    )
}

export default ClassDefinition;