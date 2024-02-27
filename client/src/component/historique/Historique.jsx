import React, { useEffect, useState } from 'react';
import './Historique.css';
import { parse, format } from 'date-fns';

const getBaseUrl = () => {
  const { hostname, protocol } = window.location;
  return `${protocol}//${hostname}:8081/`; 
};

const API_URL = getBaseUrl();

const Historique = ( { lightMode , onHistoryClose} ) => {
  const [historiqueData, setHistoriqueData] = useState([]);
  const [beneficiaryData, setBeneficiaryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [groupBy, setGroupBy] = useState('address'); // Default grouping by address
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchHistoriqueData();
    fetchBeneficiaryData();
  }, []);

  const close = () => {
    onHistoryClose();
  }

  const fetchHistoriqueData = async () => {
    try {
      const response = await fetch(`${API_URL}envoi`);
      const data = await response.json();
      setHistoriqueData(data);
    } catch (error) {
      console.error('Error fetching historique data:', error);
    }
  };

  const fetchBeneficiaryData = async () => {
    try {
      const response = await fetch(`${API_URL}benefs`);
      const data = await response.json();
      setBeneficiaryData(data);
    } catch (error) {
      console.error('Error fetching beneficiary data:', error);
    }
  };

  const organizeHistoriqueDataByBeneficiaryAddress = () => {
    const organizedData = {};

    historiqueData.forEach((envoi) => {
      const beneficiaryName = envoi.Env_dest;
      const beneficiaryAddress = getBeneficiaryAddress(beneficiaryName);

      if (!organizedData[beneficiaryAddress]) {
        organizedData[beneficiaryAddress] = [];
      }

      organizedData[beneficiaryAddress].push(envoi);
    });

    return organizedData;
  };

  const organizeHistoriqueDataByAgence = () => {
    const organizedData = {};

    historiqueData.forEach((envoi) => {
      const agence = envoi.Env_agence_depot;

      if (!organizedData[agence]) {
        organizedData[agence] = [];
      }

      organizedData[agence].push(envoi);
    });

    return organizedData;
  };

  const getBeneficiaryAddress = (beneficiaryName) => {
    const beneficiary = beneficiaryData.find((b) => b.Ben_Nom === beneficiaryName);
    return beneficiary ? beneficiary.Ben_Addresse : '';
  };

  const organizedData = groupBy === 'address'
    ? organizeHistoriqueDataByBeneficiaryAddress()
    : organizeHistoriqueDataByAgence();

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);

    const filteredResults = historiqueData.filter((envoi) => {
      const formattedDate = envoi.Env_date_depot
        ? format(new Date(envoi.Env_date_depot), 'MM/dd/yyyy', { timeZone: 'Africa/Nairobi' })
        : '';

      return (
        Object.values(envoi).some(
          (value) =>
            typeof value === 'string' &&
            (value.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (formattedDate && formattedDate.includes(searchTerm)))
        ) ||
        formattedDate.includes(searchTerm)
      );
    });

    setSearchResults(filteredResults);
    setShowSearchResults(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
  };
  
  
  return (
    <div className={`historique-container ${lightMode ? 'light-mode' : ''}`}>
      <div className='history-header'>
        <div className='sorting metho'>
          <button className="close-btn" onClick={close}>Fermer</button>
            <span className='list-deposit'>Liste des Depots</span>
             {/* Group By Dropdown */}
            <div className='group-by-dropdown'>
          <label htmlFor='groupBy'>Group By:</label>
          <select
            id='groupBy'
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value='address'>Address</option>
            <option value='agence'>Agence</option>
          </select>
        </div>
        </div>
        <div className='search-bar-history'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button onClick={handleClearSearch}>Clear</button>
        </div>
        </div>

      <div className='main-history-container'>
        {showSearchResults ? (
          <div className='search-results'>
            <h2>Search Results</h2>
            {searchResults.map((result) => (
              <div key={result.Env_id} className='historique-item'>
                <p>
                  <strong>From:</strong> {result.Env_exp}
                  <span className='separator'> | </span>
                  <strong>To:</strong> {result.Env_dest}
                </p>
                <span>&nbsp;</span>
                <p>
                  <strong>Details:</strong> {`Num: ${result.Env_num}, Poids: ${result.Env_poids}g , Taxe: ${result.Env_taxe} Ar `}
                </p>
                <span>&nbsp;</span>
                <p>
                  <strong>Date:</strong>{' '}
                  {result.Env_date_depot &&
                    new Date(result.Env_date_depot).toLocaleDateString('en-US', {
                      timeZone: 'Africa/Nairobi',
                    })}
                  <span className='separator'> | </span>
                  <strong>Agence:</strong> {result.Env_agence_depot}
                  <span className='separator'> | </span>
                  <strong>Address:</strong> {getBeneficiaryAddress(result.Env_dest)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className='historique list'>
        {Object.keys(organizedData).map((groupKey) => (
          <div className='grouping' key={groupKey}>
            <h2>
              {`${groupBy === 'address' ? 'Address' : 'Agence'}: ${groupKey} (${
                organizedData[groupKey].length !== 1
                  ? `nombre de depots: ${organizedData[groupKey].length}`
                  : 'nombre de depot: 1'
              })`}
            </h2>
            {organizedData[groupKey].map((envoi) => (
                  <div key={envoi.Env_id} className='historique-item'>
                    <p>
                      <strong>From:</strong> {envoi.Env_exp}
                      <span className='separator'> | </span>
                      <strong>To:</strong> {envoi.Env_dest}
                    </p>
                    <span>&nbsp;</span>
                    <p>
                      <strong>Details:</strong> {`Num: ${envoi.Env_num}, Poids: ${envoi.Env_poids}g , Taxe: ${envoi.Env_taxe} Ar `}
                    </p>
                    <span>&nbsp;</span>
                    <p>
                      <strong>Date:</strong>{' '}
                      {envoi.Env_date_depot &&
                        new Date(envoi.Env_date_depot).toLocaleDateString('en-US', {
                          timeZone: 'Africa/Nairobi',
                        })}
                      <span className='separator'> | </span>
                      <strong>{groupBy === 'address' ? 'Agence' : 'Address'}:</strong> {groupBy === 'address' ? envoi.Env_agence_depot : getBeneficiaryAddress(envoi.Env_dest)}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        </div>
    </div>
  );
};

export default Historique;
