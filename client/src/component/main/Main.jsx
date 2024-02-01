import { useState,useEffect } from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import Depot from '../depot/Depot';
import Nombre from '../depot/Nombre';
import User from '../user/User';
import Destinataire from '../destinataire/Destinataire';
import Configuration from '../configuration/Configuration';
import Welcome from '../welcome/Welcome';
import Historique from '../historique/Historique';
import F12 from '../F12/F12';
import GroupDetail from '../group_detail/GroupDetail';
import Agence from '../agence/Agence';
import '../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInbox, faFileAlt, faListAlt, faCog } from '@fortawesome/free-solid-svg-icons'; 

const Main = () => {
  const navigate = useNavigate();
  const [clickedDiv, setClickedDiv] = useState(null);
  const [clickedP, setClickedP] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHistorique, setShowHistorique] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(true);
  
  const [lightMode, setLightMode] = useState(() => {
    const storedMode = localStorage.getItem('lightMode');
    return storedMode === 'true';
  });
  const [groupList, setGroupList] = useState([]); 

  useEffect(() => {
    
    fetchGroupList();
  }, []);

  const fetchGroupList = async () => {
    try {
      const response = await fetch('http://localhost:8081/groupement');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const groupData = await response.json();
      setGroupList(groupData);
    } catch (error) {
      console.error('Error fetching group list:', error);
    }
  };

  const Logout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('lastClickedComponent');
    navigate('/');
  };

  const handleMouseEnter = (section) => {
    setClickedDiv((prevClickedDiv) => (prevClickedDiv === section ? null : section));
  };


  const handleClickedP = (p) => {
    console.log('Clicked component:', p);
  
    if (p) {
      setClickedP(p);
      setShowHistorique(false);
      setShowDetail(false);
      localStorage.setItem('lastClickedComponent', p);
      console.log('Stored last clicked component:', p);
    } else {
      console.error('Invalid component name:', p);
    }
  };
 
  
  useEffect(() => {
    const storedClickedComponent = localStorage.getItem('lastClickedComponent');
      console.log('Stored last clicked component:', storedClickedComponent);
      if (storedClickedComponent) {
        setClickedP(storedClickedComponent);
      }

    const storedMode = localStorage.getItem('lightMode');
    if (storedMode) {
      setLightMode(storedMode === 'true');
    }
  
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  
  }, []);
  const handleWelcomeClick = (clickedSection) => {
    setClickedP(clickedSection);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toogleLeave = () => {
    setShowDropdown(null);
  };
  // const handleCloseApp = () => {
  //   const { remote } = window.require('electron');
  //   const currentWindow = remote.getCurrentWindow();
  //   currentWindow.close();
  // };

  const modifyUser = (loggedInUser) => {
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    navigate('/user');
  };
  
  
  const handleHistoryClick = () => {
    setShowHistorique(true);
  };
   const back = () => {
    setShowHistorique(false);
   }
  const handleShowDetail = (group) => {
    setSelectedGroup(group);
    setShowDetail(true);
  };
  
  
  const toggleTheme = () => {
    setLightMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('lightMode', newMode.toString());
      return newMode;
    });
  };

  const containerClass = lightMode ? 'container light-mode' : 'container';
  const sidebarClass = lightMode ? 'sidebar light-mode' : 'sidebar';
  const contentClass = lightMode ? 'content light-mode' : 'content';
  const headerClass = lightMode ? 'header light-mode': 'header';

  const renderContent = () => {
    if (showHistorique) {
      return <Historique onHistoryClose={back}  />;
    } else if (showDetail) {
      return <GroupDetail selectedGroup={selectedGroup} onClose={() => setShowDetail(false)} />;
    } else {
      switch (clickedP) {
        case 'Particulier':
          return <Depot onHistoryClick={handleHistoryClick} lightMode={lightMode} />;
        case 'En nombre':
          return <Nombre onHistoryClick={handleHistoryClick} lightMode={lightMode} />;
          case 'F12' :  
          return <F12 />
        case 'Groupement': 
          return <Configuration onDetailClick={handleShowDetail} lightMode={lightMode} />;
        case 'Utilisateur':
          return <User lightMode={lightMode} />;
        case 'Destinataire':
          return <Destinataire lightMode={lightMode} />;
        case 'Agence':
          return <Agence onWelcomeClick={handleWelcomeClick} lightMode={lightMode} />
        case 'home':
          return <Welcome onWelcomeClick={handleWelcomeClick} lightMode={lightMode} setLastClickedComponent={setClickedP} />;
        default:
          return <Welcome onWelcomeClick={handleWelcomeClick} lightMode={lightMode} setLastClickedComponent={setClickedP} />;
      }
    }
  };
  
  
  return (
    <div className={containerClass}>
      <header className={headerClass}>
  <div className='poste'></div>
  <div className='home' onClick={() => handleClickedP('home')}></div>
  
  <div className='user-class'>
    <div className='user-name'>{loggedInUser?.Us_nom}</div>
    <div
      onMouseEnter={toggleDropdown}
      onMouseLeave={toogleLeave}
      className={`user-dropdown ${showDropdown ? 'active' : ''}`}
    >
      {showDropdown && (
        <div className="dropdown-content">
          <div onClick={() => modifyUser(loggedInUser)} >Modification</div>
          <div>Pass</div>
          <button onClick={Logout} className="Btn">
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <h2 className="text">Logout</h2>
          </button>
        </div>
      )}
    </div>
        <label className="ui-switch">
                <input type="checkbox"
                id="themeToggle"
                onChange={toggleTheme}
                checked={lightMode}
                className="theme-toggle"/>
                <div className="slider">
                  <div htmlFor="themeToggle" className="circle"></div>
                </div>
              </label>
        </div>
     
      </header>

      <div className="content-container">
        <aside className={sidebarClass}>
        <div className="main-div" onClick={() => handleClickedP('home')}>
          <FontAwesomeIcon icon={faHome} /> Home
        </div>          
          <div className="main-div" onClick={() => handleMouseEnter('depot')}>
            <FontAwesomeIcon icon={faInbox} /> Depot
            {clickedDiv === 'depot' && (
              <>
                <p onClick={() => handleClickedP('Particulier')}>Particulier</p>
                <p onClick={() => handleClickedP('En nombre')}>En nombre</p>
              </>
            )}
          </div>
          <div className="main-div" onClick={() => handleMouseEnter('operation')}>
            <FontAwesomeIcon icon={faFileAlt} /> Operation
          </div>
          <div className="main-div" onClick={() => handleMouseEnter('edition')}>
            <FontAwesomeIcon icon={faListAlt} /> Edition
            {clickedDiv === 'edition' && (
              <>
                <p>Registre</p>
                <p onClick={() => handleClickedP('F12')}>F12</p>
                <p>Etats</p>
              </>
            )}
          </div>
          <div className="main-div" onClick={() => handleMouseEnter('configuration')}>
            <FontAwesomeIcon icon={faCog} /> Configuration
            {clickedDiv === 'configuration' && (
              <>
                <p onClick={() => handleClickedP('Groupement')}>Groupement</p>
                <p onClick={() => handleClickedP('Utilisateur')}>Utilisateurs</p>
                <p onClick={() => handleClickedP('Destinataire')}>Destinataires</p>
                <p onClick={() => handleClickedP('Agence')}>Agence</p>
              </>
            )}
          </div>          
      <div className='sidebarshow'> ☰ </div>
          {/* <button onClick={handleCloseApp}>Close App</button> */}
        </aside>
        <div className={contentClass}>{renderContent()}</div>
       
      </div>
    </div>
  );
};

export default Main;
