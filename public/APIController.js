const URL = 'https://api.spotify.com'


/**
 * Инкапсуляция методов запросов к API
 * @type {{getArtists(*, *): Promise<*>, getBestSoundArtists(*, *): Promise<*>, getToken(): Promise<*>, getAlbums(*): Promise<*>}}
 */
export const APIController = (function() {
    const clientId = '6e3308bdbd0443aabfa1e7a312cb5a3e';
    const clientSecret = '0cfd383fbac34bd5ae561df0a75eb02a';

    /**
     * Запрос на получение токена доступа
     * @returns {Promise<any>}
     * @private
     */
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        }).catch(err => console.log(err));
        console.log("tyui")
        const data = await result.json();
        localStorage.setItem("token", data.access_token);
    }



    /**
     * Запрос на получение списка из 10 артистов по совпадением с содержимым строки поиска
     * @param searchArtists
     * @param token
     * @returns {Promise<any>}
     * @private
     */
    const _getArtists = async (searchArtists, token) => {
        return GetRequestPattern(URL +'/v1/search?q=artist%3A'+ searchArtists+'&type=artist&market=ES&limit=10', token)
    }

    /**
     * Запрос на получение лучших треков выбранного артиста
     * Этот метод используется при открытии popup
     * @param searchArtists
     * @param token
     * @returns {Promise<any>}
     * @private
     */
    const _getBestSoundArtists = async (searchArtists, token) => {
        return GetRequestPattern(URL + '/v1/artists/'+ searchArtists+'/top-tracks?market=ES', token)
    }

    const GetRequestPattern = async (url, token) => {
        const result = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).catch(err => {
            console.log(err)
        });

        if(result.status !== 200){
            if(result.status === 401){
                _getToken()
                return GetRequestPattern(url, token)
            }
            else {
                throw new Error('Get error');
            }
        }
        else {
            const data = await result.json();
            return data;
        }
    }

    return {
        getArtists(search, token){
            return _getArtists(search, token)
        },
        getBestSoundArtists(search, token){
            return _getBestSoundArtists(search, token)
        }

    }
})();