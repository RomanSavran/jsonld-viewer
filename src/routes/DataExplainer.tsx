import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SystemAPI from '../services/api';
import Ajv from 'ajv';
import {
  makeStyles,
  createStyles,
  Theme,
  Button
} from '@material-ui/core';
import Table from '../components/Table';
import Spinner from '../components/Spinner';
import { modifySchemaValidateError } from '../utils/helpers';
import { RoutesContext } from '../context/RoutesContext';
import clsx from 'clsx';
import P from '../utils/platform-helper';
import { extractTextForPropertyGrid } from '../utils/helpers';
import Info from '../components/Info';

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
      resize: 'vertical',
      '&:focus': {
        border: '1px solid rgb(12, 118, 203)',
        outline: 'none'
      }
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
  classesList: Array<{ [key: string]: string }>,
  propData: Array<{ [key: string]: any }>,
  manualPathVocab: {[key: string]: string}
}

type StateValueType = {
  data: {
    currentClass: any,
    propertiesList: Array<{ [key: string]: string }> | null
  },
  loading: boolean,
  error: {
    status: boolean,
    message: string
  }
}

function getTableHeaders(language: string) {
  return language === 'en' ? [
    { id: 'category', label: 'Property category' },
    { id: 'id', label: 'Property' },
    { id: 'labelEn', label: 'Label' },
    { id: 'commentEn', label: 'Description' },
    { id: 'range', label: 'Range' },
    { id: 'value', label: 'Value' }
  ] : [
      { id: 'category', label: 'Property category' },
      { id: 'id', label: 'Property' },
      { id: 'labelEn', label: 'Label (en-us)' },
      { id: 'labelFi', label: 'Label (fi-fi)' },
      { id: 'commentEn', label: 'Description (en-us)' },
      { id: 'commentFi', label: 'Description (en-us)' },
      { id: 'range', label: 'Range' },
      { id: 'value', label: 'Value' }
    ]
}

function getValue(dataObj: any, property: any) {
  if (['data', 'metadata'].includes(property.id)) return '';
  return property.id in dataObj ? dataObj[property.id] : '';
}

function expandObj(data: {[key: string]: string} | string) {
  return typeof data === 'object' ? data : {};
}

function modifyObj(obj: any) {
  return {
    ...obj,
    ...expandObj(obj.data),
    ...expandObj(obj.metadata)
  }
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
  return '@context' in data ? data['@context'] : {
    type: 'error',
    message: 'There\'s no @context in your data'
  }
}

async function getContextFile(url: string) {
    const contextData = await SystemAPI.getContextByURL(url);
    return contextData;
}

function isSchemaExist(data: any) {
  return data && '@context' in data && '@schema' in data['@context'] ? data['@context']['@schema'] : {
    type: 'error',
    message: 'There\'s no @schema in your context file'
  }
}

async function getSchemaFile(url: string) {
    const schema = await SystemAPI.getSchemaByURL(url);

    return schema;
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
  return (typeof res === 'object' && 'type' in res && res.type === 'error') || res === 'error';
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
  propData,
  manualPathVocab
}) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('category');
  const { handleChangeCurrentPath } = useContext(RoutesContext);
  const [value, setValue] = useState('');
  const [resultValue, setResultValue] = useState<StateValueType>({
    data: {
      currentClass: null,
      propertiesList: null
    },
    loading: false,
    error: {
      status: false,
      message: ''
    }
  });
  const viewerBlock = useRef(null);
  const language = i18n.language;

  useEffect(() => {
    handleChangeCurrentPath('data-explainer')
  }, [handleChangeCurrentPath]);

  useEffect(() => {
    if (resultValue.data.currentClass) {
      scrollTo();
    }
  }, [resultValue.data])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  }

  const scrollTo = () => {
    const offsetTop = viewerBlock.current.offsetTop;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }

  const handleClick = async () => {
    setResultValue({
      data: {
        currentClass: null,
        propertiesList: null
      },
      loading: true,
      error: {
        status: false,
        message: ''
      }
    })

    const result = await getResult(value);

    if (typeof result === 'object' && 'type' in result && result.type === 'error') {
      setResultValue({
        data: {
          currentClass: null,
          propertiesList: null
        },
        loading: false,
        error: {
          status: true,
          message: getErrorMessage(result.message)
        }
      })

      return;
    }
    const id = result
      .split('/')
      .filter((s: string) => !!s)
      .pop();
    const currentClass = classesList.find(cls => {
      const isDataProduct = cls.id.includes('DataProductContext');

      if (isDataProduct) {
       return manualPathVocab[cls.id] === id; 
      }
      return cls.id === id
    }) || null;
    const currentObj = JSON.parse(value);
    const property = propData
      .filter((property: any) => {
        return property.domain.some((domain: any) => {
          return result.includes(domain.label)
        })
      })
      .map((item: any) => {
        return {
          ...item,
          value: getValue(modifyObj(currentObj), item),
          label: language === 'fi' ? `${extractTextForPropertyGrid(item, 'fi', 'label', id)} (${extractTextForPropertyGrid(item, 'en', 'label', id)})` : extractTextForPropertyGrid(item, 'en', 'label', id),
          labelEn: extractTextForPropertyGrid(item, 'en', 'label', id),
          labelFi: extractTextForPropertyGrid(item, 'fi', 'label', id),
          commentEn: extractTextForPropertyGrid(item, 'en', 'comment', id),
          commentFi: extractTextForPropertyGrid(item, 'fi', 'comment', id),
          comment: language === 'fi' ? `${extractTextForPropertyGrid(item, 'fi', 'comment', id)} (${extractTextForPropertyGrid(item, 'en', 'comment', id)})` : extractTextForPropertyGrid(item, 'en', 'comment', id),
        }
      })
      .filter((property: any) => property.value !== '');
    setResultValue({
      data: {
        currentClass,
        propertiesList: property
      },
      loading: false,
      error: {
        status: false,
        message: ''
      }
    })
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property);
  }

  const { loading, data, error } = resultValue;
  const { propertiesList, currentClass } = data;

  return (
    <div className={classes.blockWrapper}>
      <div className={classes.block}>
        <p className={classes.title}>{t('Paste your data down below')}</p>
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
              {t('Error')}: {error.message}
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
          {t('Explain')}
        </Button>
      </div>
      {
        data.currentClass ? (
          <div
            className={classes.block}
            ref={viewerBlock}
          >
            <Info
              id={currentClass.id}
              superclasses={
                P.getParentsClasses(
                  currentClass.url,
                  P.getTab(currentClass.url),
                  currentClass.id
                )
              }
              type="class"
              isOnlyVocabulary={false}
              uri={`${window.location.origin}${currentClass.url}`}
              label={language === 'en' ? currentClass.labelEn : currentClass.labelFi}
              comment={language === 'en' ? currentClass.commentEn : currentClass.commentFi}
            />
            <Table
              headers={getTableHeaders(language)}
              order={order}
              orderBy={orderBy}
              data={propertiesList}
              handleRequestSort={handleRequestSort}
            />
          </div>
        ) : null
      }
    </div>
  )
}

export default DataExplainer;