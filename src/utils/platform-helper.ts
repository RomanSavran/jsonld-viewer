class PlatformHelper {
    getType(type: Array<string>): string {
        if (Array.isArray(type) && type.length > 0) {
            return type[0]
        } else {
            throw new Error('Invalid type')
        }
    }

    isProperty(type: string): boolean {
        return type.includes('owl#DatatypeProperty')
    }

    isClass(type: string): boolean {
        return type.includes('owl#Class')
    }

    isVisibleClass(filterList: Array<string>, id: string): boolean {
        return !filterList.some(entity => id.includes(entity))
    }

    getPath(fullPath: string, filterList: Array<string>): string {
        return fullPath
            .split('/')
            .filter(s => (
                !filterList.includes(s.toLowerCase())
            ))
            .join('/')
    }

    getTab(fullPath: string): string {
        return fullPath
            .split('/v2/')
            .pop()
            ?.split('/')
        [0] || ''
    }

    getId(fullPath: string, manualPathVocab: {[key: string]: string} | null = null): string {
        const isDataProduct = /DataProductContext|DataProductParameters|DataProductOutput/gi.test(fullPath);
        let id = fullPath
            .split('/')
            .filter(s => !!s)
            .pop() || '';

        if (manualPathVocab && isDataProduct) {
            Object.keys(manualPathVocab).forEach(key => {
                if (manualPathVocab[key] === id) {
                    id = key;
                }
            });
        }

        if (
            id.includes('DataProductParameters') ||
            id.includes('DataProductOutput')
        ) {
            return id.replace(
                /DataProductParameters|DataProductOutput/gi, 
                'DataProductContext'
            );
        }

        return id;
    }

    getParentsClasses(fullPath: string, tab: string, id: string): Array<string> {
        const parentsClasses = fullPath
            .split(tab)
            .filter(s => !!s)
            .pop()
            ?.split('/')
            .filter(s => !!s && s !== id);

        return parentsClasses || [];
    }

    checkIsVocabulary(path: string, vocabularyList: Array<string>, vocabularyIdList: Array<string>, id: string): boolean {
        return vocabularyIdList.includes(id) || path
            .split('/')
            .some(s => {
                return vocabularyList.includes(s)
            })
    }
    
    getHierarchy(path: string, id: string): string {
        console.log(path, id);
        return path
            .replace(/Vocabulary|ClassDefinitions|Schema|DataExample|Parameters|Output/gi, 'Context')
            .split('/Context/')
            .filter(s => !!s)
            .pop()
            .split('/')
            .filter(s => !!s)
            .join('/')
    }
}

export default new PlatformHelper();