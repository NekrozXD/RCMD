import React, { useState } from 'react';
import './Welcome.css';

const Welcome = ({ onWelcomeClick, lightMode, setLastClickedComponent }) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  const handleMouseEnter = (section) => {
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const handleH2Click = (section) => {
    onWelcomeClick(section); 
    setLastClickedComponent(section);
    localStorage.setItem('lastClickedComponent', section);
  };

 
  
  const isSectionActive = (section) => {
    return hoveredSection === section;
  };

  const isOperationActive = () => {
    return hoveredSection === 'operations';
  };

  const isEditionActive = () => {
    return hoveredSection === 'edition';
  };

  const isConfigurationActive = () => {
    return hoveredSection === 'configuration';
  };

  const renderH2 = (section) => (
    <h2 onClick={() => handleH2Click(section)}>{section}</h2>
  );

  const renderDepot = () => (
    <div
      className='deposit'
      onMouseEnter={() => handleMouseEnter('depot')}
      onMouseLeave={handleMouseLeave}
    >
      {isSectionActive('depot') ? (
        <>
          {renderH2('Particulier')}
          {renderH2('En nombre')}
        </>
      ) : (
        <h1>DEPOT</h1>
      )}
    </div>
  );

  const renderOperation = () => (
    <div className='operation' onMouseEnter={() => handleMouseEnter('operations')} onMouseLeave={handleMouseLeave}>
      {isOperationActive() ? (
        <h2>coming soon</h2>
      ) : (
        <h1>OPERATION</h1>
      )}
    </div>
  );

  const renderEdition = () => (
    <div className='edit' onMouseEnter={() => handleMouseEnter('edition')} onMouseLeave={handleMouseLeave}>
      {isEditionActive() ? (
        <>
          {renderH2('Registre')}
          {renderH2('F12')}
          {renderH2('Etats')}
        </>
      ) : (
        <h1>EDITION</h1>
      )}
    </div>
  );

  const renderConfiguration = () => (
    <div className='fadeinup' onMouseEnter={() => handleMouseEnter('configuration')} onMouseLeave={handleMouseLeave}>
      {isConfigurationActive() ? (
        <>
          {renderH2('Groupement')}
          {renderH2('Utilisateur')}
          {renderH2('Destinataire')}
          {renderH2('Agence')}
        </>
      ) : (
        <h1>CONFIGURATION</h1>
      )}
    </div>
  );

  return (
    <div className={`welcome ${lightMode ? 'light-mode' : ''}`}>
     
      {renderDepot()}
      {renderOperation()}
      {renderEdition()}
      {renderConfiguration()}
    </div>
  );
};

export default Welcome;
