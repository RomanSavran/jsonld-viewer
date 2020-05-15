import values from 'lodash/values';
import has from 'lodash/has';
import get from 'lodash/get';

type TextType = {
    '@language': 'en-us' | 'fi-fi',
    '@value': string
}

export type DefaultPropertyType = {
    '@id': string,
    '@type': string,
    'http://www.w3.org/2000/01/rdf-schema#label'?: TextType[],
    'http://www.w3.org/2000/01/rdf-schema#comment'?: TextType[],
    'http://www.w3.org/2000/01/rdf-schema#domain'?: Array<{ '@id': string }>,
    'http://www.w3.org/2000/01/rdf-schema#range'?: Array<{ '@id': string }>,
    'http://www.w3.org/2000/01/rdf-schema#subPropertyOf'?: Array<{ '@id': string }>,
    'https://standards.oftrust.net/v2/Vocabulary/nest': Array<{ '@id': string }>,
    'https://standards.oftrust.net/v2/Vocabulary/readonly': Array<{ '@type': string, '@value': string }>,
    'https://standards.oftrust.net/v2/Vocabulary/required': Array<{ '@type': string, '@value': string }>

}

export type ClassItemType = {
    url: string,
    id: string,
    type: string,
    label?: string,
    comment?: string,
    subClass?: string
}

export type PropertyItemType = {
    url: string,
    id: string,
    category?: string,
    comment: [{ comment: TextType[] }] | null,
    label: [{ label: TextType[] }] | null,
    range?: string,
    domain: Array<any>
}

export type NodeType = {
    path: string,
    children: string[],
    root?: boolean
}

export type PropertyTypes = {
    id: string,
    url: string,
    category: string,
    description: string,
    range: string
};

export type IdElementType = {
    id: string,
    domain: string[] | null,
    comment: TextType[] | null,
    label: TextType[] | null
}

export type PointersType = {
    [key: string]: IdElementType
}

function extractTextData<T extends object>(element: T, key: string, lang: 'en-us' | 'fi-fi') {
    const langObj = has(element, key) ? get(element, key).find((item: TextType) => get(item, '@language') === lang) : null;

    return langObj ? get(langObj, '@value') : '';
}

export function modifyClassElement(classElement: any) {
    const splitter = 'v2/Vocabulary/';
    const commentKey = 'http://www.w3.org/2000/01/rdf-schema#comment';
    const labelKey = 'http://www.w3.org/2000/01/rdf-schema#label';
    const parentKey = 'http://www.w3.org/2000/01/rdf-schema#subClassOf';

    const partialPath: string = get(classElement, '@id').split(splitter).pop() || '';
    const id: string = partialPath.split('/').pop() || '';
    const isContext: boolean = partialPath
        .split('/')
        .some((s: string) => {
            return ['Identity', 'Link', 'DataProductContext', 'Annotation'].includes(s)
        });
    const parentBody = has(classElement, parentKey) ? get(classElement, parentKey).pop() : null;
    const parentText = parentBody ? (get(parentBody, '@id').split('/').pop() || '') : '';

    const labelEn = extractTextData(classElement, labelKey, 'en-us');
    const labelFi = extractTextData(classElement, labelKey, 'fi-fi');
    const commentEn = extractTextData(classElement, commentKey, 'en-us');
    const commentFi = extractTextData(classElement, commentKey, 'fi-fi');

    const url = isContext ? `/v2/Context/${partialPath}/` : `/v2/Vocabulary/${partialPath}`;

    return {
        id,
        subClass: parentText,
        labelEn,
        labelFi,
        commentEn,
        commentFi,
        url
    }
}

function extractData(schemaKey: string, vocabKey: string, item: any, pointer: PointersType, type: 'comment' | 'label') {
    return has(item, schemaKey) ? [{ [type]: get(item, schemaKey) }] :
        has(item, vocabKey) ? get(item, vocabKey).map((element: { '@id': string }) => {
            const pointerItem = get(pointer, get(element, '@id'));

            return {
                [type]: pointerItem[type],
                domain: pointerItem.domain
            }
        }) : null
}

export function modifyProps(item: DefaultPropertyType, pointer: PointersType) {
    const splitter: string = 'v2/Vocabulary/';
    const commentVocabKey: string = 'https://standards.oftrust.net/v2/Vocabulary/comment';
    const labelVocabKey: string = 'https://standards.oftrust.net/v2/Vocabulary/label';
    const commentSchemaKey: keyof DefaultPropertyType = 'http://www.w3.org/2000/01/rdf-schema#comment';
    const labelSchemaKey: keyof DefaultPropertyType = 'http://www.w3.org/2000/01/rdf-schema#label';
    const domainKey: keyof DefaultPropertyType = 'http://www.w3.org/2000/01/rdf-schema#domain';
    const rangeKey: keyof DefaultPropertyType = 'http://www.w3.org/2000/01/rdf-schema#range';
    const categoryKey: keyof DefaultPropertyType = 'http://www.w3.org/2000/01/rdf-schema#subPropertyOf';

    const url: string = item['@id'].split(splitter).filter((s: string) => !!s).pop() || '';
    const id: string = url.split('/').filter((s: string) => !!s).pop() || '';
    const label = extractData(labelSchemaKey, labelVocabKey, item, pointer, 'label');
    const comment = extractData(commentSchemaKey, commentVocabKey, item, pointer, 'comment');
    const category = item[categoryKey] ? get(item[categoryKey], '[0].@id')
        .split('/')
        .filter((s: string) => !!s)
        .pop() : '';
    const domain = has(item, domainKey) ? get(item, domainKey)?.map(domain => {
        const domainId = get(domain, '@id');
        const isContext = domainId.includes('Identity') || domainId.includes('Link') || domainId.includes('Annotation');
        const partialPath = domainId.split('v2/Vocabulary/').pop() || '';

        return {
            label: domainId.split('/').pop() || '',
            url: isContext ? `/v2/Context/${partialPath}/` : `/v2/Vocabulary/${partialPath}`
        }
    }) : [];
    const range: string = item[rangeKey] ? get(item[rangeKey], '[0].@id')
        .split('http://www.w3.org/2001/XMLSchema#')
        .filter((s: string) => !!s)
        .pop() : null;
    return {
        id,
        url: `/v2/Vocabulary/${url}`,
        label,
        comment,
        category: category === 'owl#topDataProperty' ? '' : category,
        domain,
        range
    }
}

export function modifyIdElement(item: any): IdElementType {
    const domainKey = 'https://standards.oftrust.net/v2/Vocabulary/domain';
    const domain = has(item, domainKey) ? get(item, domainKey)
        .map((element: any) => {
            return get(element, '@id')
                .split('/')
                .filter((s: string) => !!s)
                .pop()
        }) : null

    return {
        id: get(item, '@id'),
        comment: get(item, 'http://www.w3.org/2000/01/rdf-schema#comment') || null,
        label: get(item, 'http://www.w3.org/2000/01/rdf-schema#label') || null,
        domain
    }
}

export function getRootNodes(data: { [key: string]: NodeType }) {
    return values(data).filter(node => node.root === true);
}

export function buildTree(list: Array<{ [key: string]: string }>) {
    return list.reduce((acc: any, current) => {
        const currentId: string = current.id;
        if (current.subClass) {
            let parents: string[] = current.subClass.split(', ');

            return parents.reduce((r: any, c: string) => {
                return c in r ? {
                    ...r,
                    [c]: {
                        ...r[c],
                        children: [
                            ...r[c].children,
                            currentId
                        ]
                    },
                    [currentId]: currentId in r ? r[currentId] : { path: current.url, children: [] }
                } : {
                        ...r,
                        [c]: {
                            path: c,
                            children: [currentId]
                        },
                        [currentId]: currentId in r ? r[currentId] : { path: current.url, children: [] }
                    }
            }, acc)
        }

        return currentId in acc ? {
            ...acc,
            [currentId]: {
                ...acc[currentId],
                root: true
            }
        } : {
                ...acc,
                [currentId]: {
                    path: current.url,
                    children: [],
                    root: true
                }
            }
    }, {});
}

export function getChildNodes(roots: any, node: NodeType) {
    return node.children.length ? node.children.map((path: string) => roots[path]) : [];
}

export function extractProperties(data: any): { [key: string]: PropertyTypes } {
    return Object.keys(data)
        .filter(key => data[key]['@type'] === 'owl:DatatypeProperty')
        .reduce((acc, current) => {
            const prop = data[current];
            const url: string = `/v2/Vocabulary/${get(prop, '@id').split('pot:').pop()}`;
            return {
                ...acc,
                [current]: {
                    id: current,
                    url,
                    category: prop['subPropertyOf'] || '',
                    description: has(prop, 'rdfs:comment') && has(prop, 'rdfs:comment.en-us') ? get(prop, 'rdfs:comment.en-us') : '',
                    range: get(prop, 'domain.0') || ''
                }
            }
        }, {});
};

export function extractTextForPropertyGrid(item: any, lang: string, type: 'label' | 'comment', id: string) {
    const language: 'en-us' | 'fi-fi' = lang === 'en' ? 'en-us' : 'fi-fi';
    const emptyLabelText = lang === 'en' ? 'Has no label' : 'Ei etikettiä';
    const emptyCommentText = lang === 'en' ? 'Has no description' : 'Ei kuvausta';
    const emptyText = type === 'label' ? emptyLabelText : emptyCommentText;

    if (item[type]) {
        let [res] = item[type].filter((textObj: any) => {
            return 'domain' in textObj && Array.isArray(textObj.domain) ? textObj.domain.includes(id) : false
        });

        if (res) {
            const resText = res[type] ? res[type].find((textObj: any) => get(textObj, '@language') === language) : null;
            return resText ? get(resText, '@value') : emptyText;
        }

        return emptyText;
    }

    return emptyText;
}

export function extractTextForGrid<T extends object>(item: T, language: string, type: 'label' | 'comment') {
    if (get(item, type)) {
        const enList = get(item, type).map((itemType: any) => {
            const en = itemType[type]?.find((k: TextType) => get(k, '@language') === 'en-us');

            return en ? get(en, '@value') : '';
        }).filter((s: string) => !!s);
        const fiList = get(item, type).map((itemType: any) => {
            const en = itemType[type]?.find((k: TextType) => get(k, '@language') === 'fi-fi');

            return en ? get(en, '@value') : '';
        }).filter((s: string) => !!s);

        return language === 'en' ? Array.from(new Set(enList)).join(', ') : Array.from(new Set(fiList)).join(', ');
    }

    return ''
}

export function pathNameToTabValue(path: string, id: string): string {
    if (
        id.includes('DataProductContext')
    ) {
        switch (path.toLowerCase()) {
            case 'context':
                return 'generalinformation'
            default:
                return 'generalinformation'
        }
    }
    if (
        id.includes('DataProductOutput') ||
        id.includes('DataProductParameters')
    ) {
        const params = id.includes('DataProductOutput') ? 'output' : 'parameters';
        switch (path.toLowerCase()) {
            case 'context':
                return `${params}context`;
            case 'schema':
                return `${params}jsonschema`;
            case 'dataexample':
                return 'dataexampleparameters';
            default:
                return 'generalinformation';
        }
    } else {
        switch (path.toLowerCase()) {
            case 'context':
                return 'generalinformation';
            case 'vocabulary':
                return 'vocabulary';
            case 'classdefinitions':
                return 'classdefinitions';
            case 'dataexample':
                return 'dataexample';
            case 'schema':
                return 'jsonschema';
            default:
                return 'generalinformation'
        }
    }
};

export function tabValueToPathName(tabValue: string): string {
    switch (tabValue.toLowerCase()) {
        case 'context':
            return 'Context';
        case 'generalinformation':
            return 'Context';
        case 'vocabulary':
            return 'Vocabulary';
        case 'classdefinitions':
            return 'ClassDefinitions';
        case 'jsonschema':
            return 'Schema';
        case 'dataexample':
            return 'DataExample'
        case 'parametersjsonschema':
            return 'Schema';
        case 'outputjsonschema':
            return 'Schema';
        case 'dataexampleparameters':
            return 'DataExample';
        default:
            return 'Context'
    }
}

export function setToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getLanguageFromStorage(): 'en' | 'fi' {
    const value: string | null = localStorage.getItem('language');

    if (!value) {
        return 'en';
    }

    return JSON.parse(value);
};

export function getURIListById(path: string) {
    const parameters = path.replace(/DataProductContext/gi, 'DataProductParameters');
    const output = path.replace(/DataProductContext/gi, 'DataProductOutput');

    const parametersContext = `${window.location.origin}/v2/Context/${parameters}/`;
    const parametersSchema = `${window.location.origin}/v2/Schema/${parameters}`;
    const outputContext = `${window.location.origin}/v2/Context/${output}/`;
    const outputSchema = `${window.location.origin}/v2/Schema/${output}`;

    return [
        {
            uri: parametersContext,
            title: 'ParametersContext',
        },
        {
            uri: parametersSchema,
            title: 'ParametersSchema',
        },
        {
            uri: outputContext,
            title: 'OutputContext',
        },
        {
            uri: outputSchema,
            title: 'OutputSchema',
        }
    ]
}

export function getType(type: Array<string>) {
    if (Array.isArray(type) && type.length > 0) {
        return type[0]
    } else {
        throw new Error('Invalid type')
    }
}