import React, {Ref, useEffect, useRef} from 'react';
import classes from './StylesComponents/PopupArtist.module.css'
import {IBestSound, IPerformer} from "../App";
import MainItem from "./MainItem";
import PopupTrackItem from "./PopupTrackItem";

/**
 * Форма popup-а, с отображением информации по артисту и его лучших треков
 * @param props
 * @constructor
 */
const PopupArtist = (props: {
    artistInfo: IPerformer,
    ShowArtist: Function,
    bestSoundOfArtist:IBestSound[]
    setTrackLink: Function
    audioRef: any|Ref<HTMLAudioElement>
}) => {
    /**
     * Жизненный цикл popup-а, обработка закрытия окна при клике снаружи окна popup-а
     * @param ref
     */
    function useOutsideAlerter(ref: any) {
        useEffect(() => {
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    props.ShowArtist(false)
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {

                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }


    const wrapperRef = useRef<HTMLDivElement>(null);
    useOutsideAlerter(wrapperRef);

    return (
        <div className={classes.popup}>
            <div ref={wrapperRef} className={classes.popup_content}>
                <div className={classes.popup_header}>
                    <img className={classes.popup_authorImg}
                         src={props.artistInfo.img} alt="Author"/>
                        <div className="popup_textContainer">
                            <h1 className={classes.popup_authorName}>{props.artistInfo.name}</h1>
                            <p className={classes.popup_publicCount}>
                                {props.artistInfo.followers}
                            </p>
                        </div>

                </div>
                <h2 className="heading">Популярные треки</h2>
                <div className="main_container">
                    {props.bestSoundOfArtist.map((track: IBestSound, index: number) =>
                        <PopupTrackItem key={index}
                                track={track}
                                setTrackLink={props.setTrackLink}
                                audioRef={props.audioRef}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupArtist;