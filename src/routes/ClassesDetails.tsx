import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { RoutesContext } from '../context/RoutesContext';
import {
  Grid,
  makeStyles,
  createStyles,
  useMediaQuery,
  useTheme,
  Theme,
  Tabs,
  Tab
} from '@material-ui/core';
import TreeView from '../components/TreeView';
import {
  pathNameToTabValue,
  tabValueToPathName,
  extractTextForPropertyGrid,
  getURIListById,
} from '../utils/helpers';
import {
  GeneralInformation,
  Vocabulary,
  ClassDefinition,
  Context,
  DataExample,
  JSONSchema,
  ParametersContext,
  ParametersSchema,
  OutputContext,
  OutputSchema,
  DataExampleParameters,
  GeneralInformationDataProduct
} from '../components/Tabs/Components';
import { Error404 } from '../components/Errors';
import { useTranslation } from 'react-i18next';
import P from '../utils/platform-helper';
import {
  classesDetailsPath,
  vocabularyClassList,
  vocabularyTabsList,
  dataProductTabsList,
  vocabularyIdList
} from '../utils/lists';
import Spinner from '../components/Spinner';

function getDataProductPath(path: string, tabValue: string, id: string, manualPathVocab: {[key: string]: string}) {
  const output = tabValue.includes('parameters') ? 'DataProductParameters' :
    tabValue === 'generalinformation' ? 'DataProductContext' : 'DataProductOutput';
  if (
    /DataProductContext|DataProductParameters|DataProductOutput/.test(path)
  ) {
    return path
      .split('/')
      .map(s => s in manualPathVocab ? manualPathVocab[s] : s)
      .join('/')
      .replace(/DataProductContext|DataProductParameters|DataProductOutput/gi, output)
  }
  return path
}

const tabsConfig: Array<{ value: string, label: string }> = [
  { value: 'generalinformation', label: 'General Information' },
  { value: 'context', label: 'Context' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'classdefinitions', label: 'Class Definitions' },
  { value: 'jsonschema', label: "JSON Schema" },
  { value: 'dataexample', label: 'Data Example' }
]

type ClassesDetailsProps = {
  classesList: any[],
  propData: any,
  manualPathVocab: {[key: string]: string}
}

const useStyles = makeStyles((theme) =>
  createStyles({
    inputRoot: {
      width: '100%',
      paddingLeft: 15,
      paddingRight: 15,
      fontSize: 15,
      border: '1px solid rgb(196, 203, 217)',
      color: 'rgb(70, 69, 69)',
      boxSizing: 'border-box'
    },
    tabRoot: {
      minWidth: 'auto',
      textTransform: 'capitalize',
      padding: '15px 25px',
      color: '#fff',
      opacity: 1,
      transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      [theme.breakpoints.down('md')]: {
        padding: '10px'
      }
    },
    tabWrapper: {
      position: 'relative',
      zIndex: 999,
      fontSize: 13,
      fontWeight: 600,
      lineHeight: '12px',
      fontFamily: 'Lato',
      textTransform: 'uppercase'
    },
    tabSelected: {
      color: '#1e1540',
      [theme.breakpoints.down('md')]: {
        background: '#fff',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        outline: 'none'
      }
    },
    tabsRoot: {
      borderBottom: '2px solid #fff',
      [theme.breakpoints.down('md')]: {
        border: 'none'
      }
    },
    tabsIndicator: {
      height: '100%',
      background: '#fff',
      [theme.breakpoints.down('md')]: {
        display: 'none'
      }
    },
    tabsFlexContainer: {
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        flexWrap: 'wrap'
      }
    },
    scrollButtons: {
      color: '#fff',
      [theme.breakpoints.down('md')]: {
        width: 20
      }
    }
  })
);

const ClassesDetails: React.FC<ClassesDetailsProps> = ({
  classesList,
  propData,
  manualPathVocab
}) => {
  const classes = useStyles();
  const theme: Theme = useTheme();
  const { t, i18n } = useTranslation();
  const { currentPath } = useContext(RoutesContext);
  const { pathname } = useLocation();
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const history = useHistory();
  const isDesktop: boolean = !useMediaQuery(theme.breakpoints.down('md'));
  const [hasError, setHasError] = useState(false);

  const path = P.getPath(pathname, classesDetailsPath)
  const currentTab = P.getTab(pathname);
  const id = P.getId(pathname, manualPathVocab);
  const initId = useRef(P.getId(pathname, manualPathVocab));
  const superclasses = useMemo(() => {
    return P.getParentsClasses(
      pathname,
      currentTab,
      id
    )
  }, [currentTab, id, pathname])
  const [tabValue, setTabValue] = useState(pathNameToTabValue(currentTab, pathname));

  const element: any = classesList.find(item => item.id === id);
  const isOnlyVocabulary = P.checkIsVocabulary(path, vocabularyClassList, vocabularyIdList, id);
  const isDataProduct = /DataProductContext|DataProductOutput|DataProductParameters/.test(pathname);
  const language = i18n.language;
  const shouldTreeView = currentPath === 'classes-hierarchy';

  let filteredTabsConfig: Array<{ value: string, label: string }> = isOnlyVocabulary && !isDataProduct ?
    vocabularyTabsList :
    isDataProduct && !isOnlyVocabulary ? dataProductTabsList : tabsConfig;

  const properties = useMemo(() => {
    return propData
      .filter((property: any) => {
        return property.domain.some((domain: any) => {
          return pathname.includes(domain.label)
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
  }, [pathname, propData, language, id]);

  useEffect(() => {
    if (tabValue === 'context') {
      setTabValue('context');
    } else {
      const newTab = pathNameToTabValue(currentTab, pathname) || 'generalinformation';
      setTabValue(newTab);
    }
    /* eslint-disable-next-line */
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const newTab = pathNameToTabValue(currentTab, pathname) || 'generalinformation';
    if (
      (tabValue !== newTab) &&
      (initId.current !== id)
    ) {
      setTabValue(newTab)
    } else if (
      (tabValue === newTab) &&
      (initId.current === id)
    ) {
      return;
    } else {
      forceUpdate();
    }

    initId.current = id;

    /* eslint-disable-next-line */
  }, [id])

  useEffect(() => {
    setHasError(false);
    if (
      pathname[pathname.length - 1] !== '/' &&
      ['Context', 'General Information'].includes(currentTab)
    ) {
      setHasError(true);
    }
    /* eslint-disable-next-line */
  }, [pathname]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    const newPath = `/v2/${tabValueToPathName(newValue)}/${getDataProductPath(path, newValue, id, manualPathVocab)}`.concat(
      [
        'context',
        'generalinformation',
        'parameterscontext',
        'outputcontext',
      ].includes(newValue) ? '/' : ''
    );
    setTabValue(newValue);
    history.push(newPath);
  };

  if (
    !element || 
    (P.getHierarchy(element.url, id) !== P.getHierarchy(pathname.replace(/DataProductParameters|DataProductOutput/, 'DataProductContext'), id))
  ) return <Error404 />

  const labelEn = element.labelEn || 'Has no label';
  const labelFi = element.labelFi || 'Ei etikettiä';
  const commentEn = element.commentEn || 'Has no description';
  const commentFi = element.commentFi || 'Ei kuvausta';

  const data = element ? {
    id,
    label: language === 'en' ? labelEn : `${labelFi} (${labelEn})`,
    comment: language === 'en' ? commentEn : `${commentFi} (${commentEn})`,
    superclasses
  } : null;

  const uriList = isDataProduct ? getURIListById(path, manualPathVocab) : null;

  const generalinfo = id.includes('DataProductContext') ? (
    <GeneralInformationDataProduct
      data={data}
      id={id}
      uriList={uriList}
    />
  ) : (
      <GeneralInformation
        data={data}
        properties={properties}
        id={id}
        type="class"
        shouldTreeView={shouldTreeView}
        uriList={uriList}
      />
    );

  return (
    <Grid
      container
      spacing={shouldTreeView && isDesktop ? 3 : 0}
    >
      {shouldTreeView && isDesktop ? (
        <Grid
          item
          xs={4}
        >
          <TreeView classesList={classesList} />
        </Grid>
      ) : null}
      <Grid
        item
        xs={shouldTreeView && isDesktop ? 8 : 12}
      >
        {(initId.current !== id) ? <Spinner /> : hasError ? <Error404 /> :
          (
            <>
              <Tabs
                classes={{
                  root: classes.tabsRoot,
                  indicator: classes.tabsIndicator,
                  scrollButtons: classes.scrollButtons
                }}
                variant={isDataProduct ? "scrollable" : "standard"}
                scrollButtons={isDataProduct ? "on" : "auto"}
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Tabs"
              >
                {filteredTabsConfig.map(tabConfig => {
                  return (
                    <Tab
                      value={tabConfig.value}
                      key={tabConfig.value}
                      label={t(tabConfig.label)}
                      classes={{
                        root: classes.tabRoot,
                        wrapper: classes.tabWrapper,
                        selected: classes.tabSelected
                      }}
                    />
                  )
                })}
              </Tabs>
              <div>
                {tabValue === 'generalinformation' && generalinfo}
                {tabValue === 'context' && <Context path={path} />}
                {tabValue === 'parameterscontext' && <ParametersContext />}
                {tabValue === 'parametersjsonschema' && <ParametersSchema />}
                {tabValue === 'outputcontext' && <OutputContext />}
                {tabValue === 'outputjsonschema' && <OutputSchema />}
                {tabValue === 'vocabulary' && <Vocabulary path={pathname} />}
                {tabValue === 'classdefinitions' && <ClassDefinition path={pathname} />}
                {tabValue === 'jsonschema' && <JSONSchema />}
                {tabValue === 'dataexample' && <DataExample path={pathname} />}
                {tabValue === 'dataexampleparameters' && <DataExampleParameters />}
              </div>
            </>
          )
        }
      </Grid>
    </Grid>
  )
}

export default ClassesDetails;