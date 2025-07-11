import React, {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCalendarDays, faCircleUser} from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css'


const Header: React.FC = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);

    const handleOpenMenu = () => {setIsMenuOpen(true);};
    const handleCloseMenu = () => {setIsMenuOpen(false);};

    useEffect(() => {
        if (isMenuOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {document.body.style.overflow = originalOverflow;}
        }
    })

    return (
        <div id='nav-container'>
            <div 
                ref={backgroundRef}
                id='background-menu' 
                className={isMenuOpen ? 'visible' : 'invisible'}
            >
                <div ref={mobileMenuRef} id="mobile-menu">
                    <nav>
                        <div id='mobile-menu-header'>
                            <p id="user"><span><FontAwesomeIcon icon={faCircleUser} /></span> Лев А. В.</p>
                            <button id='close-mobile-nav' onClick={handleCloseMenu}><FontAwesomeIcon icon={faBars}/></button>
                        </div>

                        <a href='#'>
                            <span><FontAwesomeIcon icon={faCalendarDays}/></span> Расписание
                        </a>
                    </nav>
                </div>
            </div>

            <header>
                <nav>
                    <button id='open-mobile-nav' onClick={handleOpenMenu}><span><FontAwesomeIcon icon={faBars}/></span></button>
                    <a href='#'>Расписание</a>
                </nav>
            </header>
        </div>
    );
}

export default Header;
