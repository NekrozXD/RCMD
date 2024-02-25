  import React, { useState,useEffect } from 'react';
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
    const [lastDeposits, setLastDeposits] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [selectedInput, setSelectedInput] = useState(null);

    const fetchBeneficiaireSuggestions = async (inputValue) => {
      try {
        const response = await fetch(`http://localhost:8081/benefs?Ben_Nom=${inputValue}`);
        const beneficiaireData = await response.json();

        // Filter suggestions based on input value
        const filteredSuggestions = beneficiaireData.filter(suggestion =>
          suggestion.Ben_Nom.toLowerCase().includes(inputValue.toLowerCase())
        );

        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error('Error fetching beneficiaire suggestions:', error);
        setSuggestions([]);
      }
    };

    const handleSuggestionClick = (suggestion) => {
      if (selectedInput === 'expediteur') {
        setExpediteurName(suggestion.Ben_Nom);
        setExpediteurAddress(suggestion.Ben_Addresse);
        setSelectedSuggestion(suggestion);
      } else if (selectedInput === 'destinataire') {
        setDestinataireName(suggestion.Ben_Nom);
        setDestinataireAddress(suggestion.Ben_Addresse);
        setSelectedSuggestion(suggestion);
      }
    
      setSuggestions([]); // Clear suggestions
    };
    
    useEffect(() => {
      const fetchLastDeposits = async () => {
        try {
          const response = await fetch('http://localhost:8081/envoi/last5');
          const data = await response.json();
          setLastDeposits(data);
        } catch (error) {
          console.error('Error fetching last deposits:', error);
        }
      };
    
      fetchLastDeposits(); // Fetch data initially
    
      const intervalId = setInterval(() => {
        fetchLastDeposits(); // Fetch data every 500ms
      }, 500);
    
      // Clear interval when component is unmounted
      return () => clearInterval(intervalId);
    }, []);
    
    // Envoi des depots vers database
    const handleEnvoiClick = async () => {
      console.log('Handling Envoi Click');
      try {
        const expediteurExists = await verifyBeneficiaire(expediteurName, expediteurAddress);

        if (!expediteurExists) {
          toast.error('expediteur inexistant');
          return;
        }

        const destinataireExists = await verifyBeneficiaire(destinataireName, destinataireAddress);

        if (!destinataireExists) {
          toast.error('Destinataire inexistant');
          return;
        }
        const expediteurGrpCode = await fetchBeneficiaireGroupCode(expediteurName);

        if (!expediteurGrpCode) {
          toast.error('erreur ');
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

        // Reset state
        setExpediteurName('');
        setExpediteurAddress('');
        setDestinataireName('J');
        setDestinataireAddress('');
        setDestinataireTel('');
        setNumero('');
        setTaxes('');
        setPoids('');

        toast.success('Dépôt effectué avec succès')
      } catch (error) {
        console.error('Error handling envoi:', error);
      }
    };

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

    //verification des baneficiaire expediteur et destinataire
    const verifyBeneficiaire = async (name) => {
      try {
        const response = await fetch(`http://localhost:8081/benefs?Ben_Nom=${name}`);
        const beneficiaireData = await response.json();
    
        console.log(`Verifying ${name}:`, beneficiaireData);
    
        const beneficiaireExists = beneficiaireData.some(beneficiaire => beneficiaire.Ben_Nom === name);
    
        if (beneficiaireExists) {
          console.log('Beneficiaire exists!');
          return true;
        } else {
          console.log('Beneficiaire does not exist.');
          return false;
        }
      } catch (error) {
        console.error('Error fetching beneficiaire data:', error);
        toast.error('An error occurred while verifying beneficiaire');
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
          console.error('Failed to send envoi data:', responseData.message);
          throw new Error(`Failed to send envoi data: ${responseData.message}`);
        }
    
        console.log('Envoi data sent successfully', responseData);
        console.log('Env_num:', envoiData.Env_num);
    
      
        if (responseData.Env_num !== null) {

          const historiqueData = {
            Env_num: envoiData.Env_num || '',
            HIst_evenement: 'EMA',
            Hist_date: envoiData.Env_date_depot || new Date().toISOString().slice(0, 19).replace("T", " "),
            Hist_etat: '1',
            Hist_agence: envoiData.Env_agence_depot || '',
          };
          

          const historiqueResponse = await fetch('http://localhost:8081/historique', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(historiqueData),
          });
    
          const parsedHistoriqueResponse = await historiqueResponse.json();
    
          if (!historiqueResponse.ok) {
            console.error('Failed to create historique entry:', parsedHistoriqueResponse.message);
            throw new Error(`Failed to create historique entry: ${parsedHistoriqueResponse.message}`);
          }
    
          console.log('Historique entry created successfully', parsedHistoriqueResponse);
    
          setSuccessPopup(true);
    
          setExpediteurName('');
          setExpediteurAddress('');
          setDestinataireName('');
          setDestinataireAddress('');
          setDestinataireTel('');
          setNumero('');
          setTaxes('');
          setPoids('');
    
          toast.success('Dépôt effectué avec succès');
        } else {
          console.error('Env_num is null in the response');
          throw new Error('Env_num is null in the response');
        }
      } catch (error) {
    
        console.error('Error handling envoi:', error);
      }
    };
    
    
    
    const handleHistoriqueClick = () => {
      onHistoryClick();
    };

    return (
      <div className={`particulier-container ${lightMode ? 'light-mode' : ''}`}>
        <h1 className='depot-head'> Dépot </h1>
        <p>Particulier</p>
        <div className='deposit-header'>  
        <h2 className='history' onClick={handleHistoriqueClick}>
          Liste des dépots
        </h2>
        </div>
        <button className="custom-button" onClick={handleEnvoiClick}>
    <div className="svg-wrapper-1">
      <div className="svg-wrapper">
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
    <span>Deposer</span>
  </button>


        <div className="input-container">
          <div className="input-group">
            <h2>Expediteur</h2>
            <input
              type="text"
              placeholder="Expediteur"
              value={selectedInput === 'expediteur' && selectedSuggestion ? selectedSuggestion.Ben_Nom : expediteurName}
              onChange={(e) => {
                setExpediteurName(e.target.value);
                setSelectedSuggestion(null); // Reset selected suggestion when typing
                fetchBeneficiaireSuggestions(e.target.value);
                setSelectedInput('expediteur');
              }}
            />
            {suggestions.length > 0 && selectedInput === 'expediteur' && (
              <ul>
                {suggestions.map((suggestion) => (
                  <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.Ben_Nom}
                  </li>
                ))}
              </ul>
            )}
           <input
            type="text"
            placeholder="Address"
            value={expediteurAddress || ''}
            onChange={(e) => setExpediteurAddress(e.target.value)}
          />

          </div>

          <div className="input-group">
            <h2>Destinataire</h2>
            <input
              type="text"
              placeholder="Destinataire"
              value={selectedInput === 'destinataire' && selectedSuggestion ? selectedSuggestion.Ben_Nom : destinataireName}
              onChange={(e) => {
                setDestinataireName(e.target.value);
                setSelectedSuggestion(null);
                fetchBeneficiaireSuggestions(e.target.value);
                setSelectedInput('destinataire');
              }}
            />
            {suggestions.length > 0 && selectedInput === 'destinataire' && (
              <ul>
                {suggestions.map((suggestion) => (
                  <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.Ben_Nom}
                  </li>
                ))}
              </ul>
            )}
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
            <h2 className='depot-ibutt'>
              Envoi
            </h2>
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
          <div className="input-group">
            <h2>AR</h2>
            <input
              className='inpu-ar'
              type="text"
              placeholder="Name"
            />
            <input
            className='inpu-ar'
              type="text"
              placeholder="Address"
            />
          </div>
        </div>
        <div className='last-deposit'>
          <h1>Dernier dépôts</h1>
        <table>
    <thead>
      <tr>
        <th>Env_num</th>
        <th>Env_poids</th>
        <th>Env_exp</th>
        <th>Env_dest</th>
        <th>Env_date_depot</th>
        <th>Env_agence_depot</th>
      </tr>
    </thead>
    <tbody>
      {lastDeposits.map((deposit) => (
        <tr key={deposit.Env_num}>
          <td>{deposit.Env_num}</td>
          <td>{deposit.Env_poids}</td>
          <td>{deposit.Env_exp}</td>
          <td>{deposit.Env_dest}</td>
          <td>{deposit.Env_date_depot}</td>
          <td>{deposit.Env_agence_depot}</td>
        </tr>
      ))}
    </tbody>
  </table>

        </div>
        <ToastContainer />
      </div>
    );
  };

  export default Depot;
