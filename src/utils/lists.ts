const classesDetailsPath: Array<string> = [
    '',
    'v2',
    'context',
    'classdefinitions',
    'vocabulary',
    'schema',
    'dataexample'
];
const filterClassList: Array<string> = [
    'AnnotationEntity',
    'DataProductOutput',
    'DataProductParameters',
    'PhysicalProperty',
    'Technical',
    'UnitOfMeasure'
];

const vocabularyIdList = [
    'Identity',
    'Link'
]

const vocabularyClassList = [
    'UnitOfMeasure',
    'Technical',
    'PhysicalProperty',
    'Annotation'
]

const vocabularyTabsList = [
    { value: 'generalinformation', label: 'General Information' },
    { value: 'vocabulary', label: 'Vocabulary' }
]

const dataProductTabsList = [
    { value: 'generalinformation', label: 'General Information' },
    { value: 'parameterscontext', label: 'Parameters Context' },
    { value: 'parametersjsonschema', label: 'Parameters JSON Schema' },
    { value: 'outputcontext', label: 'Output Context' },
    { value: 'outputjsonschema', label: 'Output JSON Schema' },
    { value: 'dataexampleparameters', label: 'Data Example' }
]

const classesIdList = [
    'Identity',
    'Annotation',
    'Link',
    'PhysicalProperty',
    'Technical',
    'UnitOfMeasure',
    'DataProductContext',
    'DataProductParameters',
    'DataProductOutput'
];

export {
    vocabularyIdList,
    vocabularyTabsList,
    dataProductTabsList,
    classesDetailsPath,
    filterClassList,
    vocabularyClassList,
    classesIdList
}