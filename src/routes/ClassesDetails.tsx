import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { RoutesContext } from '../context/RoutesContext';
import {
  Grid,
  makeStyles,
  createStyles,
  TextField,
  useMediaQuery,
  useTheme,
  Theme,
  Tabs,
  Tab
} from '@material-ui/core';
import Tree from '../components/Tree';
import {
  buildTree,
  getRootNodes,
  pathNameToTabValue,
  tabValueToPathName,
  extractTextForPropertyGrid,
  getURIListById
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
  DataExampleParameters
} from '../components/Tabs/Components';
import { Error404 } from '../components/Errors';
import { useTranslation } from 'react-i18next';

const tabsConfig: Array<{ value: string, label: string }> = [
  { value: 'generalinformation', label: 'General Information' },
  { value: 'context', label: 'Context' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'classdefinitions', label: 'Class Definitions' },
  { value: 'jsonschema', label: "JSON Schema" },
  { value: 'dataexample', label: 'Data Example' }
]

type ClassesHigherarchyType = {
  classesList: any[],
  propData: any
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
      textTransform: 'none',
      padding: '15px 25px',
      color: '#4C4C51',
      transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      [theme.breakpoints.down('md')]: {
        padding: '10px'
      }
    },
    tabWrapper: {
      position: 'relative',
      zIndex: 999,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '12px',
      fontFamily: 'Montserrat'
    },
    tabSelected: {
      color: '#fff',
      [theme.breakpoints.down('md')]: {
        background: '#0095FF',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        outline: 'none'
      }
    },
    tabsRoot: {
      borderBottom: '2px solid #0095ff',
      [theme.breakpoints.down('md')]: {
        border: 'none'
      }
    },
    tabsIndicator: {
      height: '100%',
      background: '#0095FF',
      [theme.breakpoints.down('md')]: {
        display: 'none'
      }
    },
    tabsFlexContainer: {
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        flexWrap: 'wrap'
      }
    }
  })
);

const ClassesDetails: React.FC<ClassesHigherarchyType> = ({ 
  classesList, 
  propData 
}) => {
  const classes = useStyles();
  const theme: Theme = useTheme();
  const { t, i18n } = useTranslation();
  const { currentPath } = useContext(RoutesContext);
  const location = useLocation();
  const history = useHistory();
  const isDesktop: boolean = !useMediaQuery(theme.breakpoints.down('md'));
  const lgAndMdView = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const [hasError, setHasError] = useState(false);
  const path: string = location.pathname
    .split('/')
    .filter(s => (
      !['', 'v1', 'context', 'classdefinitions', 'vocabulary', 'schema'].includes(s.toLowerCase())
    ))
    .join('/');
  const currentTab: string = location.pathname.split('/v1/').pop()?.split('/')[0] || '';
  const id: string = path.split('/').pop() || '';
  const superclasses: string[] = useMemo(() => {
    return location.pathname
      .split(currentTab)
      .filter((s: string) => !!s)
      .pop()!
      .split('/')
      .filter((s: string) => !!s && s !== id);
  }, [currentTab, id, location.pathname])
  const [tabValue, setTabValue] = useState(pathNameToTabValue(currentTab));
  const [filter, handleFilterChange] = useState('');

  const element: any = classesList.find(item => item.id === id);

  const isOnlyVocabulary: boolean = path
    .split('/')
    .some((s: string) => {
      return ['UnitOfMeasure', 'Technical', 'PhysicalProperty'].includes(s);
    }) || ['Identity', 'Link'].includes(id);
  const isOnlyContext: boolean = ['DataProductContext', 'SensorDataProductContext', 'LtifDataProductContext'].includes(id);
  const language: string = i18n.language;
  const shouldTreeView: boolean = currentPath === 'classes-hierarchy';

  const filteredTabsConfig: Array<{ value: string, label: string }> = isOnlyVocabulary && !isOnlyContext ? [
    { value: 'generalinformation', label: 'General Information' },
    { value: 'vocabulary', label: 'Vocabulary' }
  ] : isOnlyContext && !isOnlyVocabulary ? [
    { value: 'generalinformation', label: 'General Information' },
    { value: 'parameterscontext', label: 'Parameters Context' },
    { value: 'parametersjsonschema', label: 'Parameters JSON Schema' },
    { value: 'outputcontext', label: 'Output Context' },
    { value: 'outputjsonschema', label: 'Output JSON Schema' },
    { value: 'dataexampleparameters', label: 'Data Example' }
  ] : tabsConfig;

  const properties = useMemo(() => {
    return propData
    .filter((property: any) => {
      return property.domain.some((domain: any) => {
        return domain.url === location.pathname
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
  }, [location.pathname, propData, language, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTabValue(pathNameToTabValue(currentTab));
    /* eslint-disable-next-line */
  }, [currentTab && id]);

  useEffect(() => {
    setHasError(false);
    if (
      location.pathname[location.pathname.length - 1] !== '/' &&
      ['Context', 'General Information'].includes(currentTab)
    ) {
      setHasError(true);
    }
    /* eslint-disable-next-line */
  }, [location.pathname]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleFilterChange(value);
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    const newPath = `/v1/${tabValueToPathName(newValue)}/${path}`.concat(
      [
        'context', 
        'generalinformation', 
        'dataexample', 
        'parameterscontext',
        'parametersjsonschema',
        'outputcontext',
        'outputjsonschema',
        'dataexampleparameters'
      ].includes(newValue) ? '/' : ''
    );
    setTabValue(newValue);
    history.push(newPath);
  };

  const classesTree = useMemo(() => buildTree(classesList), [classesList]);
  const rootNodes = useMemo(() => getRootNodes(classesTree), [classesTree]);
  
  if (!element) return <Error404 />

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

  const uriList = isOnlyContext ? getURIListById(id) : null;

  return (
    <Grid
      container
      spacing={shouldTreeView && isDesktop ? 3 : 0}
    >
      {shouldTreeView && isDesktop ? (
        <Grid
          item
          xs={3}
        >
          <TextField
            className={classes.inputRoot}
            placeholder={t('Filter...')}
            value={filter}
            onChange={handleInputChange}
            InputProps={{
              disableUnderline: true
            }}
          />
          <Tree
            filter={filter.toLowerCase()}
            rootNodes={rootNodes}
            tree={classesTree}
          />
        </Grid>
      ) : null}
      <Grid
        item
        xs={shouldTreeView && isDesktop ? 9 : 12}
      >
        {hasError ? <Error404 /> :
          (
            <>
              <Tabs
                classes={{
                  root: classes.tabsRoot,
                  indicator: classes.tabsIndicator,
                  flexContainer: classes.tabsFlexContainer
                }}
                variant={lgAndMdView ? "scrollable" : "standard"}
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
                {tabValue === 'generalinformation' && <GeneralInformation
                  data={data}
                  properties={properties}
                  id={id}
                  type="class"
                  shouldTreeView={shouldTreeView}
                  uriList={uriList}
                />}
                {tabValue === 'context' && <Context path={path} />}
                {tabValue === 'parameterscontext' && <ParametersContext />}
                {tabValue === 'parametersjsonschema' && <ParametersSchema />}
                {tabValue === 'outputcontext' && <OutputContext />}
                {tabValue === 'outputjsonschema' && <OutputSchema />}
                {tabValue === 'vocabulary' && <Vocabulary path={location.pathname} />}
                {tabValue === 'classdefinitions' && <ClassDefinition path={location.pathname} />}
                {tabValue === 'jsonschema' && <JSONSchema />}
                {tabValue === 'dataexample' && <DataExample path={location.pathname} />}
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