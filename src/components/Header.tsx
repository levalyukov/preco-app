import '../styles/Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCalendarDays, faXmark, faUserGroup} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

function Header({newPage}: {newPage: (page: 'schedule') => void}) {
	const [menuVisible, changeMenuVisible] = useState(false);

	function handleOpenMenu() {
    changeMenuVisible(true);
    document.body.style.overflowY = 'hidden';
  };

	function handleCloseMenu() {
    changeMenuVisible(false);
    document.body.style.overflowY = 'scroll';
  };

  function resetLocalStorage() {
    if (localStorage.getItem("user_quick_schedule") != null) {
      localStorage.removeItem("user_quick_schedule"); 
      window.location.reload();
    };
  };

  return (
    <header>
			<div className={menuVisible ? 'visible' : 'invisible'} id='background'>
				<div id='mobile-menu'>
          <div id='mobile-menu-header'>
            <div id='user'>
              <p id='name'>Меню</p>
              <p id='branch'></p>
            </div>
            <button onClick={handleCloseMenu} id='nav'><span><FontAwesomeIcon icon={faXmark}/></span></button>
          </div>

          <ul>
            <a id='item' onClick={() => {newPage('schedule'); handleCloseMenu()}}>
              <span><FontAwesomeIcon icon={faCalendarDays}/></span> Расписание
            </a>

            <a id='item' onClick={() => {resetLocalStorage();}}>
              <span><FontAwesomeIcon icon={faUserGroup}/></span> Изменить учебную группу
            </a>
          </ul>

				</div>
			</div>

      <nav>
        <a onClick={() => newPage('schedule')}><span><FontAwesomeIcon icon={faCalendarDays}/></span> Расписание</a>
        <button onClick={handleOpenMenu} id='nav' className='open-nav'><span><FontAwesomeIcon icon={faBars}/></span></button>
      </nav>
    </header>
  );
};

export { Header };