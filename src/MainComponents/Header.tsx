import React from 'react';
import classes from './StylesComponents/Header.module.css'
import {APIController} from "../APIController";
import {IPerformer} from "../App";

/**
 * Хедер страницы, содержащий строку поиска исполнителей
 * @param props
 * @constructor
 */
const Header = (props: {ChangePerformers: Function}) => {

    /**
     *Функция поиска артистов при нажатии клавиши enter при фокусе на поле ввода
     * @param e
     * @constructor
     */
    const SearchArtists = async (e: any)=>{
        if(e.keyCode===13){
            const token = await APIController.getToken();
            const results = await APIController.getArtists(e.target.value, token)
            let arrayOfPerformers: IPerformer[] = []
            results.artists.items.forEach((item: any) => {
                let imgUrl = 'https://mulinecxc.ru/wp-content/uploads/2020/08/121890130.jpg';
                if(item.images.length>0){
                    imgUrl = item.images[0].url;
                }
                arrayOfPerformers.push({id: item.id, name: item.name, img: imgUrl, genre: item.genres[0], followers: item.followers.total})
            })

            props.ChangePerformers(arrayOfPerformers)
        }
    }

    return (
        <div className={classes.header}>
            <div className={classes.header_container}>
                <div>
                    <input onKeyDown={SearchArtists} type="search" autoComplete="off" className={classes.searchInput} id="search"
                           placeholder="Search..."/>
                </div>
                <p>Зарегистрироваться</p>
                <button className={classes.user_btn}>
                    <img src="img/user.svg"/>
                </button>
            </div>
        </div>
    );
};

export default Header;