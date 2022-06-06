import React from 'react';
import classes from './StylesComponents/MainItem.module.css'
import {IBestSound, IPerformer} from "../App";
import {APIController} from "../APIController";

/**
 * Элементы вывода артистов на страницу
 * @param props
 * @constructor
 */
const MainItem = (props: {performer: IPerformer, SetArtistInfo: Function, ShowPopup: Function, setBestSound:Function}) => {

    /**
     * Функция поиска лучших треков артиска, при клике на его элемент и открытие popup-а
     * @constructor
     */
    const ShowPopup = async ()=>{
        const token = await APIController.getToken()
        const sounds = await APIController.getBestSoundArtists(props.performer.id, token)
        let arrayOfSounds: IBestSound[] = []
        sounds.tracks.forEach((item: any) => {
            arrayOfSounds.push({img: item.album.images[0].url, name: item.name, url: item.preview_url})
        })
        props.setBestSound(arrayOfSounds)
        props.SetArtistInfo(props.performer)
        props.ShowPopup(true)
    }

    return (
        <div onClick={ShowPopup} className="main_elem">
            <div className={classes.main_item_container}>
                <img src={props.performer.img} className={classes.cont_img} alt="album"/>
                <h3 className={classes.cont_text}>{props.performer.name}</h3>
                <p className={classes.cont_text}>{props.performer.genre}</p>
            </div>
        </div>
    );
};

export default MainItem;