import React from 'react';
import '../styles/Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
    return (
        <div id='nav-container'>
            <header>
                <nav>
                    <a href='#'>Расписание</a>
                    <a href='#'>Эл. Журнал</a>
                    <a href='#'>Зачетка</a>
                    <a href='#'>Ссылка #5</a>
                </nav>
                <button id='mobile-nav'><FontAwesomeIcon icon={faBars}/></button>
            </header>
        </div>
    );
}

export default Header;
