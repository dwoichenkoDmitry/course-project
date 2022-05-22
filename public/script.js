const audio = document.querySelector('.audit')
const URL = 'https://api.spotify.com'
const search = document.querySelector('.searchInput');

/**
 * Инкапсуляция методов запросов к API
 * @type {{getArtists(*, *): Promise<*>, getBestSoundArtists(*, *): Promise<*>, getToken(): Promise<*>, getAlbums(*): Promise<*>}}
 */
const APIController = (function() {
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

        const data = await result.json();
        return data.access_token;
    }



    /**
     * Запрос на получение списка из 10 артистов по совпадением с содержимым строки поиска
     * @param searchArtists
     * @param token
     * @returns {Promise<any>}
     * @private
     */
    const _getArtists = async (searchArtists, token) => {

        const result = await fetch(URL +'/v1/search?q=artist%3A'+ searchArtists+'&type=artist&market=ES&limit=10 ', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).catch(err => console.log(err));

        const data = await result.json();
        return data;
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

        const result = await fetch(URL + '/v1/artists/'+ searchArtists+'/top-tracks?market=ES', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        }).catch(err => console.log(err));

        const data = await result.json();
        return data;
    }



    return {
        getToken() {
            return _getToken();
        },
        getArtists(search, token){
            return _getArtists(search, token)
        },
        getBestSoundArtists(search, token){
            return _getBestSoundArtists(search, token)
        }

    }
})();


/**
 * Запрос и вывод артистов по совпадением с содержимым строки поиска
 * @returns {Promise<void>}
 */
const searchArtists = async () => {
    const token = await APIController.getToken();
    document.cookie = token;
    const results = await APIController.getArtists(search.value, getTokenFromCookie());

    document.querySelector('.main').innerHTML = '<div class="main_container">\n' +
        '\n' +
        '        </div>';
    document.querySelector('.container-1').classList = 'container-1'

    results.artists.items.forEach((item) => {
        let imgUrl = 'https://mulinecxc.ru/wp-content/uploads/2020/08/121890130.jpg';
        if(item.images.length>0){
            imgUrl = item.images[0].url;
        }
        document.querySelector('.main_container').innerHTML+= '' +
            '          <div class="main_elem">\n' +
            '            <div class="main_item_container">\n' +
            '              <img src="'+ imgUrl +'" class="cont_img" alt="album">\n' +
            '              <h3 class="ArtistName cont_text">'+ item.name +'</h3>\n' +
            '              <p class="cont_text">' + item.genres[0] + '</p>\n' +
            '                <div class="hidenInfoId hidenText">'+ item.id+'</div>\n'+
            '                <div class="hidenInfoPublicCount hidenText">'+ item.followers.total+'</div>\n' +
            '            </div>\n' +
            '          </div>'
    })
    AddEventForClick();
}
searchArtists();


/**
 * Событие сокрытия popup-а
 */
document.querySelector('.popup')
    .addEventListener('click', function (e) {
        let popupContent = document.querySelector('.popup')
        if(e.target==popupContent){
            document.querySelector('.popup').classList += ' popup_disabled';
        }
    });


/**
 * Открытие popup-а и заполнение первичных данных
 * @constructor
 */
function AddEventForClick(){
    document.querySelectorAll('.main_elem').forEach((item) => {
        item.addEventListener('click', function (e) {
            let popup = document.querySelector('.popup');
            popup.classList.remove('popup_disabled');
            popup.querySelector('.popup_authorName').innerHTML =
                e.currentTarget.querySelector('.ArtistName').innerHTML;
            popup.querySelector('.popup_authorImg').src =
                e.currentTarget.querySelector('.cont_img').src;

            popup.querySelector('.popup_followCount_value').innerHTML =
                e.currentTarget.querySelector('.hidenInfoPublicCount').innerHTML;

            fillPopup(e.currentTarget.querySelector('.hidenInfoId').innerHTML, popup)
        });
    });
}

/**
 * функция получения токена из cookie файлов
 * @returns {string}
 */
function getTokenFromCookie(){
    if (document.cookie.length > 0) {
        let startIndex = document.cookie.indexOf("token=");
        if (startIndex != -1) {
            startIndex = startIndex + 6;

            return document.cookie.substring(startIndex);
        }
    }
    return "";
}

/**
 * Заполнение popup-а лучшими треками исполнителя
 * Никак не могу понять, что именно вынести в отдельный метод
 * И итерируемая коллекция, и метод заполнения совершенно разные
 * @param search
 * @param popup
 * @returns {Promise<void>}
 */
const fillPopup = async (search, popup) => {
    popup.querySelector('.main_container').innerHTML="";
    const results = await APIController.getBestSoundArtists(search, getTokenFromCookie());
    results.tracks.forEach((item) => {
        let imgUrl = item.album.images[0].url;

        popup.querySelector('.main_container').innerHTML+= '' +
            '          <div class="main_elem">\n' +
            '            <div class="main_item_container">\n' +
            '              <img src="'+ imgUrl +'" class="cont_img" alt="album">\n' +
            '              <h3 class="ArtistName cont_text">'+ item.name +'</h3>\n' +
            '              <div class="hidenTrack hidenText">' + item.preview_url+'</div>\n'+
            '            </div>\n' +
            '          </div>'
    })
    AddEventForSound(popup)
}

/**
 * Добавление события выбора прослушивания превью трека
 * @param popup
 * @constructor
 */
function AddEventForSound(popup){
    popup.querySelectorAll('.main_elem').forEach((item) => {
        item.addEventListener('click', function (e) {
            if(item.querySelector('.hidenTrack').innerHTML !== 'null'){
            document.querySelector('.audit').src =
                item.querySelector('.hidenTrack').innerHTML;
            }
            else{
                alert("Артист не добавил запись на этот трек")
            }

            PlayerPlay();
            document.querySelector('.popup').classList += ' popup_disabled';
        })
    })
}

/**
 * Методы управления воспроизведением мелодии
 * @constructor
 */
function PlayerPause(){
    audio.pause();
}

function PlayerPlay(){
    audio.play()
}

function PlayerMinus(){
    if(audio.volume > 0.1){
        audio.volume-=0.1
    }
}

function PlayerPlus(){
    if(audio.volume < 1){
        audio.volume+=0.1
    }
}