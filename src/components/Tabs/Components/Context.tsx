import React, { useState, useEffect } from 'react';
import Spinner from '../../Spinner';
import SystemAPI from '../../../services/api';
import URI from '../../URI';
import MarkdownPT from '../../Markdown';
import ContentViewer from '../../ContentViewer';
import mdFileCV from '../../../assets/context.md';
import { Error404 } from '../../Errors';

type ContextProps = {
    path: string
}

type ContextStateTypes = {
    content: any,
    loading: boolean,
    error: boolean
}

const Context: React.FC<ContextProps> = (props) => {
    const {
        path
    } = props;
    const [value, setValue] = useState<ContextStateTypes>({
        content: '',
        loading: true,
        error: false
    });
    const [mdFile, setMDFile] = useState<string | null>(null);
    const query = `/v2/Context/${path}/`;
    const id = path.split('/').pop() || '';

    useEffect(() => {
        let mounted = false;

        SystemAPI.getData(query)
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
				fileName={`Context-${id}`}
			/>
			<MarkdownPT 
				source={mdFile}
			/>
		</div>
    )
}

export default Context;