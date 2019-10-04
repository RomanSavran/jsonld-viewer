const _baseLink = 'https://api.github.com';
const _baseOwnerName = 'PlatformOfTrust';
const _baseReposName = 'standards';

export default class GithubApi {
    getData = async (pathToFile) => {
        const url = this._createURL(pathToFile);

        const res = await fetch(url, {
            headers: {
                'Authorization': 'token ee615be4190ff2aef2760b6b8709fd87edced7e0',
            }
        });

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`);
        }

        return await res.json();
    }

    getDetails = async (contextURL, vocabURL, classDefinitionURL) => {
        const options = {
            headers: {
                'Authorization': 'token ee615be4190ff2aef2760b6b8709fd87edced7e0'
            }
        }
        const contextRes =  await fetch(this._createURL(contextURL), options);
        const contextData = await contextRes.json();

        const vocabRes = await fetch(this._createURL(vocabURL), options);
        const vocabData = await vocabRes.json();

        const classDefinitionRes = await fetch(this._createURL(classDefinitionURL), options);
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