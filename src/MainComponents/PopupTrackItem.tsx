import React, {Ref} from 'react';
import classes from './StylesComponents/PopupTrackItem.module.css'
import {IBestSound} from "../App";

/**
 * Элементы вывода треков артиста в popup, с обработкой передачи превью трека при клике по соответствующему ему элементу
 * @param props
 * @constructor
 */
const PopupTrackItem = (props: {track: IBestSound, setTrackLink: Function, audioRef: any|Ref<HTMLAudioElement>}) => {

    /**
     * функция смены трека в плеере, с проверкой, добавил ли артист превью трека
     * @constructor
     */
    function ChangeAudio(){
        if(props.track.url!==null){
            props.setTrackLink(props.track.url)
            setTimeout(() => {props.audioRef.current.play()},10)

        }
        else {
            alert("Пользователь не добавил этот трек")
        }
    }

    return (
        <div onClick={ChangeAudio} className={classes.main_elem}>
            <div className={classes.main_item_container}>
                <img src={props.track.img} className={classes.cont_img} alt="album"/>
                <h3 className={classes.cont_text}>{props.track.name}</h3>
            </div>
        </div>
    );
};

export default PopupTrackItem;