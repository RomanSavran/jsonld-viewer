const _baseLink = 'https://api.github.com';
const _baseOwnerName = 'PlatformOfTrust';
const _baseReposName = 'standards';

export default class GithubApi {
    getData = async (pathToFile) => {
        const url = this._createURL(pathToFile);

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`);
        }

        return await res.json();
    }

    getDetails = async (contextURL, vocabURL, classDefinitionURL) => {
        const contextRes =  await fetch(this._createURL(contextURL));
        const contextData = await contextRes.json();

        const vocabRes = await fetch(this._createURL(vocabURL));
        const vocabData = await vocabRes.json();

        const classDefinitionRes = await fetch(this._createURL(classDefinitionURL));
        const classDefinitionData = await classDefinitionRes.json();
        
        return {
            contextData,
            vocabData,
            classDefinitionData
        }
    }

    _createURL(pathToFile) {
        return `${_baseLink}/repos/${_baseOwnerName}/${_baseReposName}/contents/${pathToFile}.jsonld`;
    }
}