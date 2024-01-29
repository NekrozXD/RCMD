import React, { useState,useEffect } from 'react';
import './Destinataire.css';
import Papa from 'papaparse';

const Destinataire = ({ lightMode }) => {
  const [formData, setFormData] = useState({
    Grp_code: '',
    Ben_Nom: '',
    Ben_Addresse: '',
    Ben_code: '',
    file: null,
  });
  const [groupList, setGroupList] = useState([]);
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [fileName, setFileName] = useState('');
  const [mappedData, setMappedData] = useState([]);
  
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

  const fetchBenefs = async () => {
    try {
      const response = await fetch('http://localhost:8081/benefs');
      if (!response.ok) {
        throw new Error(`HTTP error Status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming 'data' is an array of objects with the given structure
      const mappedData = data.map((beneficiary) => {
        return {
          Ben_id: beneficiary.Ben_id,
          Grp_code: beneficiary.Grp_code,
          Ben_Nom: beneficiary.Ben_Nom,
          Ben_Addresse: beneficiary.Ben_Addresse,
          Ben_code: beneficiary.Ben_code,
          Ben_nom: beneficiary.Agence_nom || '', // Assuming Agence_nom may be undefined
        };
      });

      setMappedData(mappedData);

    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchBenefs();
  }, []);
//import et lecture de fichier csv 
  const parseCSV = (content) => {
    try {
      const parsedData = Papa.parse(content, { header: true }).data;
      return parsedData;
    } catch (error) {
      console.error('Error parsing CSV:', error);
      return null;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    setFormData((prevData) => ({ ...prevData, file }));
    setFileName(file.name);
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      console.log('CSV Content:', content);
  
     
      const parsedData = parseCSV(content);
      if (!file) {
      
        console.log('No file selected');
        return;
      }
      if (parsedData && parsedData.length > 1) {
        const dataArray = parsedData.slice(0);
        console.log('Parsed Data:', dataArray);
  
        for (const row of dataArray) {
          const { Grp_code, Ben_Nom, Ben_Addresse, Ben_code } = row;
  
          if (Grp_code || Ben_Nom || Ben_Addresse || Ben_code) {
            
            await sendToServer(Grp_code, Ben_Nom, Ben_Addresse, Ben_code);
          }
        }
        setFormData((prevData) => ({ ...prevData, csvData: parsedData }));
  
      }
    };
  
    reader.readAsText(file);
  };
  
  
  const sendToServer = async (Grp_code, Ben_Nom, Ben_Addresse, Ben_code) => {
    try {
      const response = await fetch('http://localhost:8081/benefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Grp_code, Ben_Nom, Ben_Addresse, Ben_code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('Beneficiary added successfully!');
    } catch (error) {
      console.error('Error adding beneficiary:', error);

    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendDataButtonClick = (e) => {
    e.preventDefault(); 

    console.log('Sending data:', formData);

    handleSubmit(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/benefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        console.log('Beneficiary added successfully!');
        setSuccessPopup(true);
      }

      setFormData({
        Grp_code: '',
        Ben_Nom: '',
        Ben_Addresse: '',
        Ben_code: '',
      });

      setTimeout(() => {
        setSuccessPopup(false);
      }, 3000); 
    } catch (error) {
      console.error('Error adding beneficiary:', error);

      setErrorPopup(true);

      setTimeout(() => {
        setErrorPopup(false);
      }, 3000);
    }
  };

  
  return (
    <div className={`destinataire-container${lightMode ? 'light-mode' : ''}`}>
      <h1>Destinataire</h1>
      <div className='main-dest'>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Group code</th>
              <th>Addresse</th>
              <th>Matricule</th>
            </tr>
          </thead>
          <tbody>
            {mappedData.map((beneficiary) => (
              <tr key={beneficiary.Ben_id}>
                <td>{beneficiary.Ben_Nom}</td>
                <td>{beneficiary.Grp_code}</td>
                <td>{beneficiary.Ben_Addresse}</td>
                <td>{beneficiary.Ben_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  <div className='side-dest'> 
      <div className='input-container'>
        <div className='input-first'>
          <label htmlFor='fileInput' className='label-file'>
            Importer un fichier exel <p>example.csv(comma delimited)</p>
          </label>
          <input type='file' id='fileInput' accept='.csv' onChange={handleFileChange} />
          <div>{fileName && `Fichier selectioné: ${fileName}`}</div>
          <button className="ajouter-button" type='button' onClick={handleSendDataButtonClick}>
            Ajouter
          </button>
        </div>
       
    
        <div className='input-destinataire-group'>
          <h2>Destinataire unique</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor='groupSelect'>Sélectionner le groupe:</label>
            <select
              id='groupSelect'
              name='Grp_code'
              value={formData.Grp_code}
              onChange={handleChange}
            >
              <option value=''>Sélectionner un groupe</option>
              {groupList.map((group) => (
                <option key={group.Grp_code} value={group.Grp_code}>
                  {group.Grp_nom}
                </option>
              ))}
            </select>
  
            <input
              type='text'
              name='Ben_Nom'
              placeholder='Nom'
              value={formData.Ben_Nom}
              onChange={handleChange}
            />
            <input
              type='text'
              name='Ben_Addresse'
              placeholder='Addresse'
              value={formData.Ben_Addresse}
              onChange={handleChange}
            />
            <input
              type='text'
              name='Ben_code'
              placeholder='Matricule'
              value={formData.Ben_code}
              onChange={handleChange}
            />
  
            <button className="ajouter-button" type='submit'>Ajouter</button>
          </form>
          
        </div>
        
  
        {successPopup && (
          <div className='popup-success-popup'>Beneficiary added successfully!</div>
        )}
  
        {errorPopup && (
          <div className='popup-error-popup'>
            Error adding beneficiary. Please try again.
          </div>
        )}
      </div>
    </div>
    </div>
  );
  
};

export default Destinataire;
