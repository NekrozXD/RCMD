import React, { useState } from 'react';

const WelcomeSaisie = ({ onWelcomeClick, lightMode, setLastClickedComponent }) => {
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
  
    const renderConfiguration = () => (
      <div className='fadeinup' onMouseEnter={() => handleMouseEnter('configuration')} onMouseLeave={handleMouseLeave}>
        {isConfigurationActive() ? (
          <>
            {renderH2('Groupement')}    
            {renderH2('Destinataire')}  
          </>
        ) : (
          <h1>CONFIGURATION</h1>
        )}
      </div>
    );
  
    return (
      <div className={`welcome ${lightMode ? 'light-mode' : ''}`}>
       
        {renderDepot()}
        {renderConfiguration()}
      </div>
    );
  };

export default WelcomeSaisie