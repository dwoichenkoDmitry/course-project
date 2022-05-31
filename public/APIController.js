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
        let token = getTokenFromCookie()
        if(token){
            return token
        }
        else{
            const result = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: 'grant_type=client_credentials'
            }).catch(err => console.log(err));
            const data = await result.json();
            document.cookie = 'accessToken=' + data.access_token
            return data.access_token
        }
    }

    /**
     * Получение токена доступа из cookie
     * @returns {string}
     */
    function getTokenFromCookie(){
        let name = 'accessToken'
        if (document.cookie.length > 0) {
            let start = document.cookie.indexOf(name + "=");
            if (start !== -1) {
                start = start + name.length + 1;
                let end = document.cookie.indexOf(";", start);
                if (end === -1) {
                    end = document.cookie.length;
                }
                return unescape(document.cookie.substring(start, end));
            }
        }
        return "";
    }

    /**
     * Запрос на получение списка из 10 артистов по совпадением с содержимым строки поиска
     * @param searchArtists
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
            throw new Error(err);
        });



        const data = await result.json();
        return data;

    }

    return {
        getToken(){
            return _getToken()
        },
        getArtists(search, token){
            return _getArtists(search, token)
        },
        getBestSoundArtists(search, token){
            return _getBestSoundArtists(search, token)
        }

    }
})();