import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Depot.css';

const Depot = ({ onHistoryClick, lightMode }) => {
  const [expediteurName, setExpediteurName] = useState('');
  const [expediteurAddress, setExpediteurAddress] = useState('');
  const [destinataireName, setDestinataireName] = useState('');
  const [destinataireAddress, setDestinataireAddress] = useState('');
  const [destinataireTel, setDestinataireTel] = useState('');
  const [numero, setNumero] = useState('');
  const [montant, setMontant] = useState('');
  const [poids, setPoids] = useState('');
  const [taxes, setTaxes] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);

  // Envoi des depots vers database
  const handleEnvoiClick = async () => {
    console.log('Handling Envoi Click');

    try {
      const expediteurExists = await verifyBeneficiaire(expediteurName, expediteurAddress);

      if (!expediteurExists) {
        alert('Expediteur not found in beneficiaire table');
        return;
      }

      const destinataireExists = await verifyBeneficiaire(destinataireName, destinataireAddress);

      if (!destinataireExists) {
        alert('Destinataire not found in beneficiaire table');
        return;
      }
      const expediteurGrpCode = await fetchBeneficiaireGroupCode(expediteurName);

      if (!expediteurGrpCode) {
        alert('Group code not found for the expediteur');
        return;
      }
      
      const agenceNom = await fetchAgenceNom(expediteurGrpCode);
      

      if (!agenceNom) {
        alert('Agence nom not found for the expediteur');
        return;
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");

      const envoiData = {
        Env_num: numero,
        Env_poids: poids,
        Env_exp: expediteurName,
        Env_dest: destinataireName,
        Env_taxe: taxes,
        Env_date_depot: formattedDate.slice(0, 10),
        Env_agence_depot: agenceNom,
      };

      const response = await sendEnvoiData(envoiData);

      if (response && response.error) {
        throw new Error(`Failed to send envoi data: ${response.error}`);
      }

      console.log('Envoi added successfully!');
      setSuccessPopup(true);

      // Reset state
      setExpediteurName('');
      setExpediteurAddress('');
      setDestinataireName('');
      setDestinataireAddress('');
      setDestinataireTel('');
      setNumero('');
      setMontant('');
      setPoids('');

      setTimeout(() => {
        setSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error handling envoi:', error);

      setErrorPopup(true);

      setTimeout(() => {
        setErrorPopup(false);
      }, 3000);
    }
  };

  //verification des baneficiaire expediteur et destinataire
  const fetchBeneficiaireGroupCode = async (name) => {
    try {
      const response = await fetch(`http://localhost:8081/benefs?Ben_Nom=${name}`);
      const beneficiaireData = await response.json();

      console.log(`Beneficiaire data for ${name}:`, beneficiaireData);

      if (beneficiaireData.length > 0) {
        const expediteurData = beneficiaireData.find(beneficiaire => beneficiaire.Ben_Nom === name);
        return expediteurData.Grp_code;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching beneficiaire data:', error);
      return null;
    }
  };
  const verifyBeneficiaire = async (name) => {
    try {
      const response = await fetch(`http://localhost:8081/benefs?Ben_Nom=${name}`);
      const beneficiaireData = await response.json();
  
      console.log(`Verifying ${name}:`, beneficiaireData);
  
      return beneficiaireData.length > 0;
    } catch (error) {
      console.error('Error verifying beneficiaire:', error);
      return false;
    }
  };
  

  const fetchAgenceNom = async (Grp_code) => {
    try {
      const agenceResponse = await fetch(`http://localhost:8081/agence`);
      const agenceData = await agenceResponse.json();
  
      console.log(`Agence data:`, agenceData);
  
      const matchedAgence = agenceData.find(agence => agence.Agence_code === Grp_code);
  
      if (!matchedAgence) {
        console.error(`No matching Agence for Grp_code: ${Grp_code}`);
        return null;
      }

      const agenceNom = matchedAgence.Agence_nom;
  
      if (!agenceNom) {
        console.error(`Agence nom not found for Agence_code: ${Grp_code}`);
        return null;
      }
  
      return agenceNom;
    } catch (error) {
      console.error('Error fetching agence nom:', error);
      return null;
    }
  };
  
  

  const sendEnvoiData = async (envoiData) => {
    try {
      const response = await fetch('http://localhost:8081/envoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envoiData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to send envoi data: ${responseData.message}`);
        
      }

      console.log('Envoi data sent successfully', responseData);
      toast.success('data sent succesfully')
      return responseData;
    } catch (error) {
      console.error('Error sending envoi data', error);
      throw error;
    }
  };

  const handleHistoriqueClick = () => {
    onHistoryClick();
  };

  return (
    <div className={`particulier-container ${lightMode ? 'light-mode' : ''}`}>
      <h1>Particulier</h1>
      <h2 className='history' onClick={handleHistoriqueClick}>
        Deposit list
      </h2>
      <button className ="custom-button" onClick={handleEnvoiClick}>
      <div class="svg-wrapper-1">
        <div class="svg-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </div>
      </div>
      <span>Submit</span>
    </button>

      <div className="input-container">
        <div className="input-group">
          <h2>Expediteur</h2>
          <input
            type="text"
            placeholder="Name"
            value={expediteurName}
            onChange={(e) => setExpediteurName(e.target.value)}
          />
          <input
            className='bottom-input'
            type="text"
            placeholder="Address"
            value={expediteurAddress}
            onChange={(e) => setExpediteurAddress(e.target.value)}
          />
        </div>

        <div className="input-group">
          <h2>Destinataire</h2>
          <input
            type="text"
            placeholder="Name"
            value={destinataireName}
            onChange={(e) => setDestinataireName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={destinataireAddress}
            onChange={(e) => setDestinataireAddress(e.target.value)}
          />
          <input
            className='bottom-input'
            type="text"
            placeholder='Tel if exterieur'
            value={destinataireTel}
            onChange={(e) => setDestinataireTel(e.target.value)}
          />
        </div>
      </div>
      <div className="input-container">
        <div className="input-group">
          <h1 className='depot-butt' onClick={handleEnvoiClick}>
            Envoi
          </h1>
          <input
            type='text'
            placeholder='Numero'
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <input
            type='text'
            placeholder='Montant'
            value={taxes}
            onChange={(e) => setTaxes(e.target.value)}
          />
          <input
            className='bottom-input'
            type='text'
            placeholder='Poids'
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
          />
        </div>
        {successPopup && (
          <span className='success-popup-success'>send successfully!</span>
        )}

        {errorPopup && (
          <div className='error-popup'>
            Error when sending
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Depot;
