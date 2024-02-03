import React, { useState, useEffect } from 'react';
import './Destinataire.css';
import Papa from 'papaparse';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';

const Destinataire = ({ lightMode }) => {
  const [formData, setFormData] = useState({
    Grp_code: '',
    Ben_Nom: '',
    Ben_Addresse: '',
    Ben_code: '',
    file: null,
  });
  const [groupList, setGroupList] = useState([]);
  const [fileName, setFileName] = useState('');
  const [mappedData, setMappedData] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 9;

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

      const mappedData = data.map((beneficiary) => ({
        Ben_id: beneficiary.Ben_id,
        Grp_code: beneficiary.Grp_code,
        Ben_Nom: beneficiary.Ben_Nom,
        Ben_Addresse: beneficiary.Ben_Addresse,
        Ben_code: beneficiary.Ben_code,
        Ben_nom: beneficiary.Agence_nom || '',
      }));

      setMappedData(mappedData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchBenefs();
  }, []);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayMappedData = formData.file
  ? mappedData
      .slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage)
      .map((beneficiary) => (
        <tr key={beneficiary.Ben_id}>
          <td>{beneficiary.Ben_Nom}</td>
          <td>{beneficiary.Grp_code}</td>
          <td>{beneficiary.Ben_Addresse}</td>
          <td>{beneficiary.Ben_code}</td>
        </tr>
      ))
  : null;


    const parseCSV = (content) => {
      try {
        const parsedData = Papa.parse(content, { header: true }).data;
    
        // Filter out empty lines
        const filteredData = parsedData.filter((row) => {
          // Check if any value in the row is not empty
          return Object.values(row).some((value) => value !== '');
        });
    
        return filteredData;
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
      if (!file || !parsedData || parsedData.length <= 1) {
        console.log('Invalid file or no data found');
        return;
      }
  
      const dataArray = parsedData.slice(0);
      console.log('Parsed Data:', dataArray);
  
      const extractedData = dataArray.map((row) => ({
        Grp_code: row.Grp_code,
        Ben_Nom: row.Ben_Nom,
        Ben_Addresse: row.Ben_Addresse,
        Ben_code: row.Ben_code,
      }));
      setMappedData(extractedData);
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


const handleSendCSVButtonClick = async () => {
  try {
    if (mappedData.length > 0) {
      // Sending data from the CSV
      for (const entry of mappedData) {
        const { Grp_code, Ben_Nom, Ben_Addresse, Ben_code } = entry;
        await sendToServer(Grp_code, Ben_Nom, Ben_Addresse, Ben_code);
      }

      toast.success('Data sent successfully from CSV');

      setMappedData([]);

      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    } else {
      console.log('No data to send from mappedData');
    }
  } catch (error) {
    console.error('Error adding beneficiaries:', error);

    toast.error('Error adding beneficiary');

    setTimeout(() => {
      toast.dismiss();
    }, 3000);
  }
};


const handleChange = (e) => {
  setFormSubmitted(false); // Reset the formSubmitted state when any input changes
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSendFormButtonClick = async (e) => {
  e.preventDefault();

  try {
    // Check if any input fields are empty before attempting to send data
    if (
      !formData.Grp_code ||
      !formData.Ben_Nom ||
      !formData.Ben_Addresse ||
      !formData.Ben_code
    ) {
      setFormSubmitted(true); // Set formSubmitted to true if there are empty fields
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    // Sending data from the form
    await sendToServer(
      formData.Grp_code,
      formData.Ben_Nom,
      formData.Ben_Addresse,
      formData.Ben_code
    );

    toast.success('Data sent successfully from form');

    setFormData({
      Grp_code: '',
      Ben_Nom: '',
      Ben_Addresse: '',
      Ben_code: '',
    });

    setTimeout(() => {
      toast.dismiss();
    }, 3000);
  } catch (error) {
    console.error('Error adding beneficiaries:', error);

    toast.error('Error adding beneficiary');

    setTimeout(() => {
      toast.dismiss();
    }, 3000);
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    for (const data of mappedData) {
      const { Grp_code, Ben_Nom, Ben_Addresse, Ben_code } = data;

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
    }

  } catch (error) {
    console.error('Error adding beneficiary:', error);
    toast.warning('error sendind data')
  } finally {
    setFormData({
      Grp_code: '',
      Ben_Nom: '',
      Ben_Addresse: '',
      Ben_code: '',
    });

  }
};

  
  return (
    <div className={`destinataire-container${lightMode ? 'light-mode' : ''}`}>
    <h1>Destinataire</h1>
    <div className='main-dest'>
      {formData.file ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Group code</th>
                <th>Addresse</th>
                <th>Matricule</th>
              </tr>
            </thead>
            <tbody>{displayMappedData}</tbody>
          </table>
          <ReactPaginate
            pageCount={Math.ceil(mappedData.length / itemsPerPage)}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            disableInitialCallback={true}
          />
        </>
      ) : (
        <p>Inserez un fichier</p>
      )}
    </div>

  <div className='side-dest'> 
      <div className='input-container'>
        <div className='input-first'>
          <label htmlFor='fileInput' className='label-file'>
            Importer un fichier exel <p>example.csv(comma delimited)</p>
          </label>
          <input type='file' id='fileInput' accept='.csv' onChange={handleFileChange} />
          <div>{fileName && `Fichier selectioné: ${fileName}`}</div>
          <button className="ajouter-button" type='button' onClick={handleSendCSVButtonClick}>
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

    <div className="input-with-warning">
      <input
        type='text'
        name='Ben_Nom'
        placeholder='Nom'
        value={formData.Ben_Nom}
        onChange={handleChange}
      />
      {formSubmitted && !formData.Ben_Nom && (
        <div className="warning-icon-container">
          {/* Insert your warning icon here */}
          <i className="warning-icon">⚠️</i>
        </div>
      )}
    </div>

    <div className="input-with-warning">
      <input
        type='text'
        name='Ben_Addresse'
        placeholder='Addresse'
        value={formData.Ben_Addresse}
        onChange={handleChange}
      />
      {formSubmitted && !formData.Ben_Addresse && (
        <div className="warning-icon-container">
          {/* Insert your warning icon here */}
          <i className="warning-icon">⚠️</i>
        </div>
      )}
    </div>

    <div className="input-with-warning">
      <input
        type='text'
        name='Ben_code'
        placeholder='Matricule'
        value={formData.Ben_code}
        onChange={handleChange}
      />
      {formSubmitted && !formData.Ben_code && (
        <div className="warning-icon-container">
          {/* Insert your warning icon here */}
          <i className="warning-icon">⚠️</i>
        </div>
      )}
    </div>

    <button className="ajouter-button" onClick={handleSendFormButtonClick} type='submit'>Ajouter</button>
  </form>
</div>


      </div>
    </div>

            <ToastContainer />
    </div>
  );
  
};

export default Destinataire;
