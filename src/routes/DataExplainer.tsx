import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SystemAPI from '../services/api';
import Ajv from 'ajv';
import {
  makeStyles,
  createStyles,
  Theme,
  Button
} from '@material-ui/core';
import Spinner from '../components/Spinner';
import { modifySchemaValidateError } from '../utils/helpers';
import { RoutesContext } from '../context/RoutesContext';
import clsx from 'clsx';
import { extractTextForPropertyGrid } from '../utils/helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: 0,
      marginBottom: 20
    },
    iconButton: {
      padding: 2
    },
    textarea: {
      width: '100%',
      height: 316,
      minHeight: 316,
      padding: 20,
      fontFamily: 'Roboto',
      fontWeight: 300,
      background: 'linear-gradient(0deg,rgb(235, 240, 248),rgb(235, 240, 248)),rgb(29, 37, 72)',
      border: '1px solid transparent',
      boxSizing: 'border-box',
      color: 'rgb(12, 77, 123)',
      resize: 'vertical'
    },
    blockWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    block: {
      marginBottom: 20,
      padding: 20,
      border: '1px solid rgb(12, 118, 203)',
      borderRadius: 4,
      '&:last-child': {
        marginBottom: 0
      }
    },
    validateBtn: {
      display: 'block',
      margin: '0 auto',
      marginTop: 20,
      background: 'rgb(21, 72, 109)',
      borderRadius: 4,
      color: '#fff',
      '&:hover': {
        background: 'rgb(8, 44, 70)'
      },
      '&.Mui-disabled': {
        color: 'rgba(255, 255, 255, .4)'
      }
    },
    error: {
      borderColor: 'red'
    },
    errorMessage: {
      marginTop: 20,
      padding: 20,
      fontSize: 15,
      border: '1px solid red',
      borderRadius: 4,
      color: 'red',
    }
  })
);

type DataExplainerProps = {
  classesList: Array<{[key: string]: string}>,
  propData: Array<{[key: string]: string}>
}

function getErrorMessage(data: any) {
  if (Array.isArray(data)) {
    let [res] = data;
    return modifySchemaValidateError(res);
  } else {
    return data
  }
}

function parseDataExample(data: string) {
  try {
    let JSONExample = JSON.parse(data);

    return JSONExample;
  } catch {
    return {
      type: 'error',
      message: 'Your data is invalid'
    }
  }
}

function isContextExist(data: any) {
  console.log(data);
  return '@context' in data ? data['@context'] : {
    type: 'error',
    message: 'There\'s no @context in your data'
  }
}

async function getContextFile(url: string) {
  console.log(url);
  try {
    const contextData = await SystemAPI.getEntityByURL(url);

    return contextData;
  } catch {
    return {
      type: 'error',
      message: 'Couldn\'t get Context file from server'
    }
  }
}

function isSchemaExist(data: any) {
  return data && '@context' in data && '@schema' in data['@context'] ? data['@context']['@schema'] : {
    type: 'error',
    message: 'There\'s no @schema in your context file'
  }
}

async function getSchemaFile(url: string) {
  try {
    const schema = await SystemAPI.getEntityByURL(url);

    return schema;
  } catch {
    return {
      type: 'error',
      message: 'Couldn\'t get Schema from server'
    }
  }
}

function schemaValidate(schema: any, data: any) {
  const ajv = new Ajv({
    allErrors: true
  });
  const valid = ajv.validate(schema, data);

  return valid ? data['@context'] : {
    type: 'error',
    message: ajv.errors
  }
}

function isError(res: any) {
  return (typeof res === 'object' && 'type' in res && res.type === 'error') || res === 'error' ;
}

async function getResult(data: any) {
  let res1 = parseDataExample(data);

  if (isError(res1)) {
    return res1;
  }

  let res2 = isContextExist(res1);

  if (isError(res2)) {
    return res2;
  }

  let res3 = await getContextFile(res2);

  if (isError(res3)) {
    return res3
  }

  let res4 = isSchemaExist(res3);

  if (isError(res4)) {
    return res4;
  }

  let res5 = await getSchemaFile(res4);

  if (isError(res5)) {
    return res5;
  }

  return schemaValidate(res5, res1)
}

const DataExplainer: React.FC<DataExplainerProps> = ({
  classesList,
  propData
}) => {
  const classes = useStyles();
  const {pathname} = useLocation();
  const { i18n } = useTranslation();
  const {handleChangeCurrentPath} = useContext(RoutesContext);
  const [value, setValue] = useState('');
  const [resultValue, setResultValue] = useState({
    data: null,
    loading: false,
    error: {
      status: false,
      message: ''
    }
  });

  const language = i18n.language;

  useEffect(() => {
    handleChangeCurrentPath('data-explainer')
  }, [handleChangeCurrentPath]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  }

  const handleClick = async () => {
    setResultValue({
      data: null,
      loading: true,
      error: {
        status: false,
        message: ''
      }
    })

    const result = await getResult(value);

    if (typeof result === 'object' && 'type' in result && result.type === 'error') {
      setResultValue({
        data: null,
        loading: false,
        error: {
          status: true,
          message: getErrorMessage(result.message)
        }
      })

      return ;
    }
    const id = result
      .split('/')
      .filter((s: string) => !!s)
      .pop();
    const currentClass = classesList.find(cls => cls.id === id);
    const property = propData
      .filter((property: any) => {
        return property.domain.some((domain: any) => {
          return result.includes(domain.label)
        })
      })
      .map((item: any) => {
        return {
          ...item,
          label: language === 'fi' ? `${extractTextForPropertyGrid(item, 'fi', 'label', id)} (${extractTextForPropertyGrid(item, 'en', 'label', id)})` : extractTextForPropertyGrid(item, 'en', 'label', id),
          labelEn: extractTextForPropertyGrid(item, 'en', 'label', id),
          labelFi: extractTextForPropertyGrid(item, 'fi', 'label', id),
          commentEn: extractTextForPropertyGrid(item, 'en', 'comment', id),
          commentFi: extractTextForPropertyGrid(item, 'fi', 'comment', id),
          comment: language === 'fi' ? `${extractTextForPropertyGrid(item, 'fi', 'comment', id)} (${extractTextForPropertyGrid(item, 'en', 'comment', id)})` : extractTextForPropertyGrid(item, 'en', 'comment', id),
        }
      })
      console.log(currentClass, property)
  }

  const {loading, data, error} = resultValue;

  return (
    <div className={classes.blockWrapper}>
      <div className={classes.block}>
        <p className={classes.title}>Paste your data down below</p>
        <textarea
          spellCheck="false"
          className={clsx(classes.textarea, {
            [classes.error]: error.status
          })}
          rows={5}
          value={value}
          onChange={handleInputChange}
          placeholder="{}"
        ></textarea>
        {
          error.status ? (
            <div className={classes.errorMessage}>
              Error: {error.message}
            </div>
          ) : loading ? <Spinner /> : null
        }
        <Button 
          classes={{
            root: classes.validateBtn,
          }}
          onClick={handleClick}
          disabled={!value}
        >
          Explaine
        </Button>
      </div>
      {
        data ? (
          <div className={classes.block}>

          </div>
        ) : null
      }
    </div>

  )
}

export default DataExplainer;