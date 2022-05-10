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
        });

        const data = await result.json();
        return data.access_token;
    }

    /**
     * Запрос на вывод начальных артистов
     * @param token
     * @returns {Promise<any>}
     * @private
     */
    const _getAlbums = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/artists?ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    /**
     * Запрос на получение списка из 10 артистов по совпадением с содержимым строки поиска
     * @param searchArtists
     * @param token
     * @returns {Promise<any>}
     * @private
     */
    const _getArtists = async (searchArtists, token) => {

        const result = await fetch('https://api.spotify.com/v1/search?q=artist%3A'+ searchArtists+'&type=artist&market=ES&limit=10 ', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    /**
     * Запрос на получение лучших треков выбранного артиста
     * @param searchArtists
     * @param token
     * @returns {Promise<any>}
     * @private
     */
    const _getBestSoundArtists = async (searchArtists, token) => {

        const result = await fetch('https://api.spotify.com/v1/artists/'+ searchArtists+'/top-tracks?market=ES', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }



    return {
        getToken() {
            return _getToken();
        },
        getAlbums(token) {
            return _getAlbums(token);
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
    document.querySelector('.tokenHide').innerHTML = token;
    let search = document.querySelector('.searchInput').value;
    console.log(search)
    const results = await APIController.getArtists(search, token);

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



function searchClick(){
    document.querySelector('.main').innerHTML = '<div class="main_container">\n' +
        '\n' +
        '        </div>';
    document.querySelector('.container-1').classList = 'container-1'
}


/**
 * Событие сокрытия popup-а
 */
document.querySelector('.popup')
    .addEventListener('click', function (e) {
        let popupContent = document.querySelector('.popup')
        if(e.target===popupContent){
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
            console.log(e.currentTarget.querySelector('.hidenInfoId'));
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
 * Заполнение popup-а лучшими треками исполнителя
 * @param search
 * @param popup
 * @returns {Promise<void>}
 */
const fillPopup = async (search, popup) => {
    const token = await APIController.getToken();
    const results = await APIController.getBestSoundArtists(search, token);
    popup.querySelector('.main_container').innerHTML="";
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
            document.querySelector('.audit').src =
                item.querySelector('.hidenTrack').innerHTML;

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
    document.querySelector('.audit').pause();
}

function PlayerPlay(){
    let audio = document.querySelector('.audit')
    if(audio.src != "http://localhost:3000/null")
        audio.play()
}

function PlayerMinus(){
    let audio = document.querySelector('.audit')
    if(audio.volume > 0.1){
        audio.volume-=0.1
    }
}

function PlayerPlus(){
    let audio = document.querySelector('.audit')
    if(audio.volume < 1){
        audio.volume+=0.1
    }
}