import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Depot.css';
import ReactPaginate from 'react-paginate';

const getBaseUrl = () => {
  const { hostname, protocol } = window.location;
  return `${protocol}//${hostname}:8081/`; // Assuming backend is always on port 8081
};

const API_URL = getBaseUrl();

const Nombre = ({ onHistoryClick, lightMode }) => {
  const [csvData, setCSVData] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState([]);
  const [envAgenceDepotData, setEnvAgenceDepotData] = useState([]);
  const [errorCount, setErrorCount] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(0);  
  const itemsPerPage = 20;

  const offset = currentPage * itemsPerPage;
  const paginatedData = csvData.slice(offset, offset + itemsPerPage);

  //import et lecture de fichier sous format csv(comma delimited)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
  
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (result) => {
        // Filter out rows with missing or empty values in relevant columns
        const filteredData = result.data.filter(row => (
          row.Env_num && row.Env_poids && row.Env_taxe && row.Env_exp && row.Env_dest
        ));
  
        setCSVData(filteredData);
  
        const initialVerificationStatus = await Promise.all(
          filteredData.map(async (row) => {
            return await verifyBeneficiaire(row);
          })
        );
  
        setVerificationStatus(initialVerificationStatus);
      },
    });
  };
  

  //verification des beneficiare expediteur et destinataire
  const verifyBeneficiaire = async (row) => {
    try {
      const response = await fetch(`${API_URL}benefs`);
      const beneficiaireData = await response.json();

      const expediteurExists = beneficiaireData.some((beneficiaire) => {
        const beneficiaireName = (beneficiaire.Ben_Nom || '').trim();
        const envExpName = (row.Env_exp || '').trim();
        return beneficiaireName === envExpName;
      });

      const destinataireExists = beneficiaireData.some((beneficiaire) => {
        const beneficiaireName = (beneficiaire.Ben_Nom || '').trim();
        const envDestName = (row.Env_dest || '').trim();
        return beneficiaireName === envDestName;
      });

      return { expediteurExists, destinataireExists };
    } catch (error) {
      console.error('Error verifying beneficiaire:', error);
      return { expediteurExists: false, destinataireExists: false };
    }
  };

  const fetchAgenceNom = async (Grp_code) => {
    try {
      const agenceResponse = await fetch(`${U}agence`);
      const agenceData = await agenceResponse.json();

      console.log(`Agence data:`, agenceData);

      const matchedAgence = agenceData.find((agence) => agence.Agence_code === Grp_code);

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

  const updateEnvAgenceDepotData = async () => {
    try {
      const newEnvAgenceDepotData = await Promise.all(
        csvData.map(async (row) => {
          const expediteurName = (row.Env_exp || '').trim();
          const beneficiaireResponse = await fetch(`${API_URL}benefs?Ben_Nom=${expediteurName}`);
          const beneficiaireData = await beneficiaireResponse.json();

          if (beneficiaireData.length > 0) {
            const expediteurData = beneficiaireData.find((beneficiaire) => beneficiaire.Ben_Nom === expediteurName);
            const Grp_code = expediteurData?.Grp_code;

            console.log(`Beneficiaire grp_code for ${expediteurName}:`, Grp_code);

            const agenceNom = await fetchAgenceNom(Grp_code);

            console.log(`Agence nom for ${Grp_code}:`, agenceNom);

            return agenceNom;
          }

          return null;
        })
      );

      console.log('New EnvAgenceDepotData:', newEnvAgenceDepotData);
      setEnvAgenceDepotData(newEnvAgenceDepotData);
    } catch (error) {
      console.error('Error updating envAgenceDepotData:', error);
    }
  };

  const sendEnvoiData = async (envoiData) => {
    try {
      // Step 1: Send the envoi data to the server
      const response = await fetch('${U}envoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envoiData),
      });
  
      // Step 2: Parse the response JSON
      const responseData = await response.json();
  
      // Step 3: Check if the response is not OK (HTTP status other than 2xx)
      if (!response.ok) {
        console.error('Failed to send envoi data:', responseData.message);
        throw new Error(`Failed to send envoi data: ${responseData.message}`);
      }
  
      console.log('Envoi data sent successfully', responseData);
      console.log('Env_num:', envoiData.Env_num);
  
      // Check if responseData.Env_num is not null
      if (responseData.Env_num !== null) {
        // Step 4: Create historique entry using the returned data
        const historiqueData = {
          Env_num: envoiData.Env_num || '',
          HIst_evenement: 'EMA',
          Hist_date: envoiData.Env_date_depot || new Date().toISOString().slice(0, 19).replace("T", " "),
          Hist_etat: '1',
          Hist_agence: envoiData.Env_agence_depot || '',
        };
        
        // Step 5: Send the historique data to the server
        const historiqueResponse = await fetch('${U}historique', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(historiqueData),
        });
  
        // Step 6: Parse the historique response JSON
        const parsedHistoriqueResponse = await historiqueResponse.json();
  
        // Step 7: Check if the historique response is not OK
        if (!historiqueResponse.ok) {
          console.error('Failed to create historique entry:', parsedHistoriqueResponse.message);
          throw new Error(`Failed to create historique entry: ${parsedHistoriqueResponse.message}`);
        }
  
        console.log('Historique entry created successfully', parsedHistoriqueResponse);      
        toast.success('Dépôt effectué avec succès');
      } else {
        console.error('Env_num is null in the response');
        throw new Error('Env_num is null in the response');
      }
    } catch (error) {
      // Step 9: Handle errors and set error popup
      console.error('Error handling envoi:', error);
    }
  };
  

  //envoi des donnees vers database
  const handleSendAllButtonClick = async () => {

    //stop l'envoi si les donnees entree sont fausse
    const hasIncorrectEntries = verificationStatus.some(
      (status) => !status?.expediteurExists || !status?.destinataireExists
    );
  
    if (hasIncorrectEntries) {
  
      alert('Please cancel incorrect data before sending.');
      return;
    }
  
    const allEnvoiData = csvData.map((row, index) => ({
      Env_num: row.Env_num,
      Env_poids: row.Env_poids,
      Env_taxe: row.Env_taxe,
      Env_exp: row.Env_exp,
      Env_dest: row.Env_dest,
      Env_agence_depot: envAgenceDepotData[index],
    }));
  
    try {
      const responses = await Promise.all(allEnvoiData.map((envoiData) => sendEnvoiData(envoiData)));
  
      const errors = responses.filter((response) => response && response.error);
  
      if (errors.length > 0) {
        console.error('Failed to send some envoi data:', errors);
      } else {
        console.log('All envoi data sent successfully!');
        toast.success('data sent succesfully')
      }
    } catch (error) {
      console.error('Error sending envoi data', error);
    } finally {
      setTimeout(() => {
      }, 3000);
    }
  };
  

  const handleHistoriqueClick = () => {
    onHistoryClick();
  };

 
  
  useEffect(() => {
    if (csvData.length > 0) {
      updateEnvAgenceDepotData();
    }
  }, [csvData]);

  const handleCancelButtonClick = async (index) => {
    const updatedCSVData = [...csvData];
    updatedCSVData.splice(index, 1);
    const updatedVerificationStatus = await Promise.all(
      updatedCSVData.map(async (row) => {
        return await verifyBeneficiaire(row);
      })
    );

    setCSVData(updatedCSVData);
    setVerificationStatus(updatedVerificationStatus);

    
    const newErrorCount = updatedVerificationStatus.filter(
      (status) => !status?.expediteurExists || !status?.destinataireExists
    ).length;

    setErrorCount(newErrorCount);
  };
  
  useEffect(() => {
    if (csvData.length > 0) {
      updateEnvAgenceDepotData();
    }
  }, [csvData]);
  
  useEffect(() => {
    const newErrorCount = verificationStatus.filter(
      (status) => !status?.expediteurExists || !status?.destinataireExists
    ).length;
  
    setErrorCount(newErrorCount);
  }, [verificationStatus]);

  return (
    <div className={`nombre ${lightMode ? 'light-mode' : ''}`}>
      <div className='side-nbr'>
      <div style={{ display: csvData.length > 0 ? 'block' : 'none' }}>
      {errorCount > 0 ? (
        <>
          <span role="img" aria-label="Warning" style={{ color: 'red', fontSize: '1.5em' }}>
            &#9888;
          </span>
          <strong style={{ color: 'red', fontSize: '1.2em' }}>
            Erreur: {errorCount}
          </strong>
        </>
      ) : (
        <>
          <span role="img" aria-label="Success" style={{ color: 'green', fontSize: '1.5em' }}>
            ✔️
          </span>
          <strong style={{ color: 'green', fontSize: '1.2em' }}>
            Verifié!
          </strong>
        </>
      )}
    </div>

      <h2 className='history-list-nbr' onClick={handleHistoriqueClick}>
        Liste des dépots
      </h2>
      <label htmlFor='fileInput' >
        <div className='label'> Importer un fichier exel</div>    
      </label>
      <input type='file' id='fileInput' accept='.csv' onChange={handleFileUpload} />
      <button className='send-all' onClick={handleSendAllButtonClick}>
        Déposer
      </button>
      </div>
      <div className='nbr-list'>
      <table className='nbr-table'>
        <thead>
          <tr>
            <th>Numero</th>
            <th>Poids</th>
            <th>Montant</th>
            <th>Expediteur</th>
            <th>Destinataire</th>
            <th className='agence'>Agence</th>
            <th>Verification</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {paginatedData.map((row, index) => (
            <tr key={index}>
              <td>{row.Env_num}</td>
              <td>{row.Env_poids} g</td>
              <td>
                {row.Env_taxe} <span>&nbsp;</span>
                <span>&nbsp;</span>Ar
              </td>
              <td
                style={{
                  backgroundColor: verificationStatus[index]?.expediteurExists
                    ? 'rgb(0, 128, 0,0.5)'
                    : 'rgb(255, 0, 0,0.5)',
                }}
              >
                {row.Env_exp}
              </td>
              <td
                style={{
                  backgroundColor: verificationStatus[index]?.destinataireExists
                    ? 'rgb(0, 128, 0,0.5)'
                    : 'rgb(255, 0, 0,0.5)',
                }}
              >
                {row.Env_dest}
              </td>
              <td>{envAgenceDepotData[index]}</td>
              <td>
                {verificationStatus[index]?.expediteurExists && verificationStatus[index]?.destinataireExists ? (
                  <span style={{ color: 'green' }}>✔️</span>
                ) : (
                  <span style={{ color: 'red' }}>❌</span>
                )}
              </td>
              <td className='send-cancel-button'>
                {verificationStatus[index]?.expediteurExists && verificationStatus[index]?.destinataireExists ? (
                  <h3></h3>
                ) : (
                  <span>impossible de deposer</span>
                )}
                <button onClick={() => handleCancelButtonClick(index)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <div onClick={() => setCurrentPage(currentPage - 1)}>Previous</div>
        <div className="pagination-container">
          <ReactPaginate
            pageCount={Math.ceil(csvData.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            disableInitialCallback={true}
          />  
        </div>
        <div onClick={() => setCurrentPage(currentPage + 1)}>Next</div>
      </div>

      </div>
      <ToastContainer />
    </div>
  );
};

export default Nombre;
