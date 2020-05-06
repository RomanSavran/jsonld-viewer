import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ContentViewer from '../../ContentViewer';
import URI from '../../URI';
import Spinner from '../../Spinner'
import { Error404 } from '../../Errors';
import SystemAPI from '../../../services/api';

const OutputContext: React.FC = () => {
  const [value, setValue] = useState({
    data: null,
    loading: true,
    error: false
  })
  const location = useLocation();
  const path = location.pathname
    .split('/')
    .filter(s => (
      !['', 'v1', 'context', 'classdefinitions', 'vocabulary', 'schema', 'dataexample'].includes(s.toLowerCase())
    ))
    .map(s => {
      return s.replace('Context', 'Output')
    })
    .join('/')
  const id = location.pathname
    .split('/')
    .filter(s => !!s)
    .pop() || '';

  useEffect(() => {
    let mounted = false;

    (async function () {
      try {
        const data = await SystemAPI.getData(`/v1/Context/${path}/`);

        if (typeof data === 'number') {
          setValue({
            data: null,
            loading: false,
            error: true
          })
        }

        if (!mounted) {
          setValue({
            data,
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
  }, [path]);

  const { loading, data, error } = value;

  const uri = `${window.location.origin}/v1/Context/${path}`;

  if (error) return <Error404 />
  if (loading && !error) return <Spinner />

  return (
    <>
      <URI
        uri={[{
          uri,
          title: "URI"
        }]}
      />
      <ContentViewer
        content={data}
        playground={false}
        fileName={`${id}OutputContext.jsonld`}
      />
    </>
  )
}

export default OutputContext;