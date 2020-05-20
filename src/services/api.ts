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
            return {
                type: 'error',
                message: 'Something went wrong'
            };
        }
        
    }

    getContextByURL = async (url: string) => {
        try {
            const res = await fetch(url, {
                method: 'GET',
                cache: 'no-store'
            });
    
            if (!res.ok) {
                console.error('Invalid context')
                return {
                    type: 'error',
                    message: 'Invalid context'
                }
            }

            return await res.json();
        } catch (err) {
            console.error('Invalid context url')
            return {
                type: 'error',
                message: 'Invalid context url'
            };
        }
        
    }

    getSchemaByURL = async (url: string) => {
        try {
            const res = await fetch(url, {
                method: 'GET',
                cache: 'no-store'
            });
    
            if (!res.ok) {
                console.error('Invalid schema url')
                return {
                    type: 'error',
                    message: 'Invalid schema url'
                }
            }

            return await res.json();
        } catch (err) {
            console.error('Invalid schema url')
            return {
                type: 'error',
                message: 'Invalid schema url'
            };
        }
        
    }
}

export default new GithubAPI();