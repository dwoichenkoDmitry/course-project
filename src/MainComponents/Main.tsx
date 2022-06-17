import React from 'react';
import classes from './StylesComponents/Main.module.css'
import MainItem from "./MainItem";
import {IPerformer} from "../App";

/**
 * Main часть сайта, содержащая результаты поиска - артистов, по совпадениям ввода строки поиска
 * @param props
 * @constructor
 */
const Main = (props: {
    performers: IPerformer[],
    setArtistInfo: Function,
    ShowPopup: Function,
    setBestSound: Function
}) => {
    return (
        <div className={classes.main}>
            {props.performers.length>0?
                <h2 className={classes.heading}>Топ музыкантов</h2>
                :
                <h2 className={classes.NoneResults}>Ничего не найдено</h2>
            }
            <div className={classes.main_container}>
                {props.performers.length>0?
                    props.performers.map((performer: IPerformer, index: number) =>
                    <MainItem key={index}
                        SetArtistInfo={props.setArtistInfo}
                        ShowPopup={props.ShowPopup}
                        performer={performer}
                          setBestSound={props.setBestSound}
                    />
                )
                :
                    ''
                }
            </div>
        </div>
    );
};

export default Main;