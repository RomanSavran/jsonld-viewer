class GithubAPI {
    private _baseLink: string = 'https://api.github.com';
    private _baseOwnerName = 'RomanSavran';
    private _baseReposName = 'standards';

    getData = async (path: string) => {
        const url = this._createURL(path);
        const res = await fetch(url);

        if (!res.ok) {
            return res.status
        }

        return await res.json();
    }

    getOnto = async () => {
        const url = this._createURL('/v1/Ontology/pot');

        const res = await fetch(url, {
			method: 'GET',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			}
		});

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, received ${res.status}`);
		}

		return await res.json();
    }

    getVocabulary = async (path: string) => {
        const url = `${this._baseLink}${path}`;

        const res = await fetch(url);

        if (!res.ok) {
            return res.status
        }

        return await res.json();
    }

    private _createURL(pathToFile: string) {
		return `${this._baseLink}/repos/${this._baseOwnerName}/${this._baseReposName}/contents${pathToFile}.jsonld?access_token=1c1415d14760c3e511bf0ccb2dde7a27cc14f7fb&ref=ontotest`;
	}
}

export default new GithubAPI();