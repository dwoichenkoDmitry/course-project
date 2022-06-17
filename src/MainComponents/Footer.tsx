import React, {Ref, useRef} from 'react';
import classes from './StylesComponents/Footer.module.css'
import PlayImg from './img/play.svg'

/**
 * Футер страницы, содержащий плеер
 * @param props
 * @constructor
 */
const Footer = (props: {playerLink: string, audioRef: any|Ref<HTMLAudioElement>}) => {

    /**
     * функционал управления плеером
     * @constructor
     */
    function Play() {
        if (props.audioRef !== null && props.audioRef.current !== null){
            props.audioRef.current.play()
        }
    }

    function Stop() {
        if (props.audioRef !== null && props.audioRef.current !== null){
            props.audioRef.current.pause()
        }
    }

    function Minus() {
        if (props.audioRef !== null && props.audioRef.current !== null && props.audioRef.current.volume > 0.1){
            props.audioRef.current.volume -= 0.1
        }
    }

    function Plus() {
        if (props.audioRef !== null && props.audioRef.current !== null && props.audioRef.current.volume < 1){
            props.audioRef.current.volume += 0.1
        }
    }

    return (
        <div className={classes.footer}>
            <div className={classes.player}>
                <button onClick={Play} className={[classes.playerBtn, classes.playerBtnMain].join(' ')}><img className={classes.sqImg} src={PlayImg}/></button>
                <button onClick={Stop} className={[classes.playerBtn, classes.playerBtnMain].join(' ')}><img className={classes.sqImg} src="img/square.svg"/></button>
                <button onClick={Minus} className={classes.playerBtn}>-</button>
                <button onClick={Plus} className={classes.playerBtn}>+</button>
            </div>
        </div>
    );
};

export default Footer;