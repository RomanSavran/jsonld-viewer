class GithubAPI {
    private _baseLink: string = process.env.NODE_ENV === 'development' ? 'https://peaceful-springs-53690.herokuapp.com' : window.location.origin;

    getData = async (path: string) => {
        const url = `${this._baseLink}${path}`;
        const res = await fetch(url, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!res.ok) {
            return res.status
        }

        return await res.json();
    }

    getContextByLink = async (url: string) => {
        try {
            const res = await fetch(url, {
                method: 'GET',
                cache: 'no-store'
            });
    
            if (!res.ok) {
                return res.status
            }
    
            return await res.json();
        } catch (err) {
            return 'error';
        }
        
    }

    getEntityByURL = async (url: string) => {
        try {
            const res = await fetch(url, {
                method: 'GET',
                cache: 'no-store'
            });
    
            if (!res.ok) {
                return res.status
            }
    
            return await res.json();
        } catch (err) {
            return 'error';
        }
        
    }
}

export default new GithubAPI();