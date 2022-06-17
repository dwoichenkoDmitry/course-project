import React from 'react';
import classes from './StylesComponents/Aside.module.css'
import Logo from './img/logo.png'
import SearchImg from './img/search.svg'

/**
 * Левая навигационная панель
 * @constructor
 */
const Aside = () => {
    return (
        <div className={classes.aside}>
            <div className={classes.aside_container}>
                <img src={Logo} alt="лого" className={classes.logo}/>
                    <a href="#" className={[classes.icon_search, classes.nav_elem, classes.nav_icon].join(' ')}>
                        <img src={SearchImg} alt="Картинка"/>
                            Поиск
                    </a>
            </div>
        </div>
    );
};

export default Aside;