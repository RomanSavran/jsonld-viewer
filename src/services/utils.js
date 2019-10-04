import {uniq} from 'lodash';

const extractData = (data, type) => {
    return data.filter(item => item['@type'] === type)
}

const createListData = num => {
    let obj = {}

    for (let i = 1; i <= num; i++) {
        obj[i] = true;
    }

    return obj;
}

const search = (items, filter) => {
    if (!filter || filter.length === 0) {
        return items;
    }

    filter = filter.toLowerCase();

    let result = [];

    for (let nodeIdx = 0; nodeIdx <= items.length - 1; nodeIdx++) {
        let currentNode = items[nodeIdx];
        let currentId = currentNode['@id'].toLowerCase();
        let currentChildren = currentNode['children'];

        if (!currentChildren && !currentId.includes(filter)) {
            continue;
        } else if (currentId.includes(filter)) {
            if (currentChildren) {
                currentNode['children'] = search(currentChildren, filter);
            }

            result.push(currentNode);
            continue;
        } else if (!currentId.includes(filter)) {
            if (currentChildren) {
                currentNode['skip'] = true;
                currentNode['children'] = search(currentChildren, filter);
            }

            result.push(currentNode);
            continue;
        } else {
            result = [];
        }
    }
    return result;
}

const extractURL = (data, str) => {
    if(!str) {
        return ;
    }

    let url = str;

    let item = data.filter(el => {
        return el['@id'].split(':')[1] === str
    })[0];
    
    let match = item['subClassOf'].split(':')[0];
    
    if (match !== 'dli' && match !== 'rdfs') {
        url = `${extractURL(data, item['subClassOf'].split(':')[1])}/${url}`;
    } 

    return url;
}

const extractPropsURL = (data, str) => {
    if (!str) {
        return
    }

    let url = str.split(':')[1];
    let [item] = data.filter(el => el['@id'] === str);

    if ('subPropertyOf' in item) {
        url = `${extractPropsURL(data, item['subPropertyOf'])}/${url}`
    }

    return url
}

const createParentChain = (data, str) => {
    let el = data.filter(child => child['@id'].includes(str))[0]['subClassOf'];

    return el.includes('dli') || el.includes('rdfs') ? [el] : [ el, ...createParentChain(data, el)]
}

const createPropertyParentChain = (data, item) => {
    return item['category'] ? [item['category'], ...createPropertyParentChain(data, data.filter(child => child['@id'] === item['category'])[0])] : [];
}

const createQueryArray = str => {
    let data = str.split('/');

    return data.map((item, i, arr) => arr.slice(0, i + 1).join('/'));
}

const addToStorage = (key, value) => {
    return localStorage.setItem(key, JSON.stringify(value))
}

const getFromStorage = key => {
    return JSON.parse(localStorage.getItem(key));
}

const parser = (parserFn, data) => {
    return JSON.parse(parserFn.decode(data));
}

const isEmptyProps = (...objArray) => {
    return objArray.map(obj => {
        return Object.keys(obj).map(prop => obj[prop] !== null).every(el => el === true)
    }).every(el => el === true);
}

const isSameProps = (array, propName) => {
    let sameProps = array.filter(el => el['@id'] === `pot:${propName}` || el['@id'] === `dli:${propName}`);

    return sameProps.length === 2
}

const createURL = (str, list) => {
    let arrayURL = str.split('/');

    const item = arrayURL[arrayURL.length - 1];
    const mainURL = extractURL(list, item);
    const contextURL = arrayURL.join('/');

    return {mainURL, contextURL, item}
}

const strToName = (str) => {
    return str.split(' ').map((word, idx) => {
        return !idx ? word[0].toLowerCase() + word.slice(1) : word[0].toUpperCase() + word.slice(1)
    }).join('');
}

const transformProperties = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error ('transformProperties function expected the array')
    }

    return arr.map(el => {
        let newEl = {};

        newEl['@id'] = el['@id'];
        newEl['@type'] = el['@type'];

        if ('dli:label' in el) {
            let notUniqArr = el['dli:label']
                            .filter(el => el['rdfs:label']['@language'] === 'en-us')
                            .map(el => el['rdfs:label']['@value'])
            newEl['label'] = uniq(notUniqArr).join(', ')
        }
        if (!('dli:label' in el)) {
            newEl['label'] = ''
        }

        if ('dli:comment' in el) {
            let notUniqArr = el['dli:comment']
                            .filter(el => el['rdfs:comment']['@language'] === 'en-us')
                            .map(el => el['rdfs:comment']['@value'])
            newEl['comment'] = uniq(notUniqArr).join(', ')
        }
        if (!('dli:comment' in el)) {
            newEl['comment'] = ''
        }

        if ('subPropertyOf' in el) {
            newEl['category'] = el['subPropertyOf']
        }
        if (!('subPropertyOf' in el)) {
            newEl['category'] = ''
        }

        if ('domain' in el) {
            newEl['domain'] = el['domain'].join(', ')
        }
        if (!('domain' in el)) {
            newEl['domain'] = ''
        }

        if ('range' in el) {
            newEl['range'] = el['range'].join(', ')
        }

        if (!('range' in el)) {
            newEl['range'] = ''
        }

        return newEl
    })
}

const transformClasses = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error ('transformProperties function expected the array')
    }

    return arr.map(el => {
        let newEl = {};

        newEl['@id'] = el['@id'];
        newEl['@type'] = el['@type'];
        newEl['subClassOf'] = el['subClassOf'];

        if ('dli:label' in el) {
            let notUniqArr = el['dli:label']
                            .filter(el => el['rdfs:label']['@language'] === 'en-us')
                            .map(el => el['rdfs:label']['@value'])
            newEl['label'] = uniq(notUniqArr).join(', ')
        }
        if (!('dli:label' in el)) {
            newEl['label'] = ''
        }

        if ('dli:comment' in el) {
            let notUniqArr = el['dli:comment']
                            .filter(el => el['rdfs:comment']['@language'] === 'en-us')
                            .map(el => el['rdfs:comment']['@value'])
            newEl['comment'] = uniq(notUniqArr).join(', ')
        }
        if (!('dli:comment' in el)) {
            newEl['comment'] = ''
        }

        return newEl
    })
}

const capitalizeFirstLetter = (str) => {
    const result = str
        .split(' ')
        .filter(word => typeof word[0] === 'string')
        .map(word => {
            word = word.charAt(0).toUpperCase() + word.substr(1);
            return word;
        })
        .join(' ');

    return result;
}

export {
    extractData, createListData, 
    search, extractURL, 
    createQueryArray, createParentChain,
    addToStorage, getFromStorage,
    parser, isEmptyProps, createURL,
    strToName, extractPropsURL,
    createPropertyParentChain, transformProperties,
    transformClasses, isSameProps, capitalizeFirstLetter
}