import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { RoutesContext } from '../context/RoutesContext';
import { get, has } from 'lodash';
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
    ClassItemType,
    buildTree,
    getRootNodes,
    pathNameToTabValue,
    tabValueToPathName,
    extractTextForDetails,
} from '../utils/helpers';
import {
    GeneralInformation,
    Vocabulary,
    ClassDefinition,
    Context,
    DataExample
} from '../components/Tabs/Components';
import { Error404 } from '../components/Errors';
import { useTranslation } from 'react-i18next';
import Spinner from '../components/Spinner';
import SystemAPI from '../services/api';

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
            [theme.breakpoints.down('xs')]: {
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
            [theme.breakpoints.down('xs')]: {
                background: '#0095FF',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                outline: 'none'
            }
        },
        tabsRoot: {
            borderBottom: '2px solid #0095ff',
            [theme.breakpoints.down('xs')]: {
                border: 'none'
            }
        },
        tabsIndicator: {
            height: '100%',
            background: '#0095FF',
            [theme.breakpoints.down('xs')]: {
                display: 'none'
            }
        },
        tabsFlexContainer: {
            [theme.breakpoints.down('xs')]: {
                display: 'flex',
                flexWrap: 'wrap'
            }
        }
    })
);

const tabsConfig: Array<{ value: string, label: string }> = [
    { value: 'generalinformation', label: 'General Information' },
    { value: 'context', label: 'Context' },
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'classdefinitions', label: 'Class Definitions' },
    { value: 'dataexample', label: 'Data Example' }
];

interface ClassDetailsI {
    classesData: ClassItemType[],
    propData: any
}

const ClassDetails: React.FC<ClassDetailsI> = (props) => {
    const classes = useStyles();
    const theme: Theme = useTheme();
    const { t, i18n } = useTranslation();
    const { currentPath } = useContext(RoutesContext);
    const location = useLocation();
    const history = useHistory();
    const isDesktop: boolean = !useMediaQuery(theme.breakpoints.down('md'));
    const [filter, handleFilterChange] = useState('');
    const [vocabValues, setVocabValues] = useState({
        data: null,
        loading: true,
        error: false,
    })
    const {
        classesData,
        propData
    } = props;
    const currentTab: string = location.pathname
        .split('/')
        .filter((s: string) => !!s && s !== 'v1')[0];
    const [tabValue, setTabValue] = useState(pathNameToTabValue(currentTab));
    const path: string = location.pathname
        .split(`/v1/${currentTab}`)
        .filter(s => !!s)[0]
        .split('/')
        .filter(s => !!s)
        .join('/');
    const id: string | null = path.split('/').pop() || '';
    const superclasses: string[] = path.split('/').filter(s => !!s && s !== id);
    const currentClass: ClassItemType | null = classesData.find(item => item.id === id) || null;
    const isOnlyVocabulary: boolean = path
        .split('/').some(s => {
            return ['UnitOfMeasure', 'Technical', 'PhysicalProperty'].includes(s)
        }) || ['Identity', 'Link'].includes(id);
    const language: string = i18n.language;
    const potLanguage = language === 'en' ? 'en-us' : 'fi-fi';
    const shouldRenderTree: boolean = currentPath === 'classes-hierarchy';
    const filteredTabsConfig: Array<{ value: string, label: string }> = isOnlyVocabulary ? [
        { value: 'generalinformation', label: 'General Information' },
        { value: 'vocabulary', label: 'Vocabulary' }
    ] : tabsConfig;
    const properties = useMemo(() => {
        return path
            .split('/')
            .filter(s => !!s)
            .map(s => {
                return propData.filter((element: any) => element.domain ? element.domain.includes(s) : false)
            })
            .flat()
            .map((item: any) => {
                return {
                    ...item,
                    label: extractTextForDetails(path, item, language, 'label'),
                    comment: extractTextForDetails(path, item, language, 'comment')
                }
            })
    }, [language, path, propData])

    useEffect(() => {
        window.scrollTo(0, 0);
        setTabValue(pathNameToTabValue(currentTab));

        /* eslint-disable-next-line */
    }, [currentTab && id]);

    useEffect(() => {
        let mounted = false;

        if (location.pathname[location.pathname.length - 1] !== '/' &&
            ['Context', 'General Information'].includes(currentTab)
        ) {
            if (!mounted) {
                setVocabValues({
                    data: null,
                    loading: false,
                    error: true
                })
            }
        } else {
            SystemAPI.getData(`v1/Vocabulary/${path}`)
                .then(data => {
                    if (!mounted) {
                        if (typeof data === 'number') {
                            setVocabValues({
                                data: null,
                                loading: false,
                                error: true
                            })
                        } else {
                            setVocabValues({
                                data,
                                loading: false,
                                error: false
                            })
                        }
                    }
                })
        }

        return () => {
            mounted = true;
        }

        /* eslint-disable-next-line */
    }, [location.pathname]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        handleFilterChange(value);
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        const newPath = `/v1/${tabValueToPathName(newValue)}/${path}`.concat(
            ['context', 'generalinformation', 'dataexample'].includes(newValue) ? '/' : ''
        );
        setTabValue(newValue);
        history.push(newPath);
    };

    const isLoading = vocabValues.loading && !vocabValues.error;
    const classesTree = useMemo(() => buildTree(classesData), [classesData]);
    const rootNodes = useMemo(() => getRootNodes(classesTree), [classesTree]);
    const vocabClass = vocabValues.data ? get(vocabValues.data, id) : null;
    const label = vocabClass && has(vocabClass, 'rdfs:label') ? get(vocabClass, `rdfs:label.${potLanguage}`) : t('Has no label');
    const comment = vocabClass && has(vocabClass, 'rdfs:comment') ? get(vocabClass, `rdfs:comment.${potLanguage}`) : t('Has no description');

    return (
        <Grid
            container
            spacing={shouldRenderTree && isDesktop ? 3 : 0}
        >
            {shouldRenderTree && isDesktop ? (
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
                xs={shouldRenderTree && isDesktop ? 9 : 12}
            >
                {isLoading ? <Spinner /> :
                    vocabValues.error ? <Error404 /> :
                    (
                        <>
                            <Tabs
                                classes={{
                                    root: classes.tabsRoot,
                                    indicator: classes.tabsIndicator,
                                    flexContainer: classes.tabsFlexContainer
                                }}
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
                                    data={{
                                        id,
                                        label,
                                        comment,
                                        superclasses
                                    }}
                                    properties={properties}
                                    id={id}
                                    type="class"
                                />}
                                {tabValue === 'context' && <Context path={path} />}
                                {tabValue === 'vocabulary' && <Vocabulary path={location.pathname} />}
                                {tabValue === 'classdefinitions' && <ClassDefinition path={location.pathname} />}
                                {tabValue === 'dataexample' && <DataExample path={location.pathname} />}
                            </div>
                        </>
                    )
                }
            </Grid>
        </Grid>
    )
}

export default ClassDetails;