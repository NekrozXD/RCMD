import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { debounce } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Status.css';

const Status = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(9); 
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInputTouched, setIsInputTouched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true); 
  const [selectedEnvStatus, setSelectedEnvStatus] = useState(null);
  const [inputValue, setInputValue] = useState('');


  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8081/histenvoi')
        .then(response => response.json())
        .then(data => setHistoricalData(data))
        .catch(error => console.error('Error fetching data:', error));
    };

    fetchData(); 

    const intervalId = setInterval(fetchData, 5000); 

    return () => clearInterval(intervalId); 
  }, []);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    setIsInputTouched(true);
    setShowSuggestions(value.trim() !== '');
  };

  useEffect(() => {
    if (selectedItem) {
      setSelectedEnvStatus(selectedItem.HIst_evenement);
    } else {
      setSelectedEnvStatus(null);
    }
  }, [selectedItem]);
  

  const handleSearch = (value) => {
    const searchResults = historicalData.filter(item => item.Env_num.toString() === value);
    setFilteredData(searchResults);
    setIsInputTouched(true);
    setShowSuggestions(true);
  };
  
  
  
  
  const hideSuggestions = () => {
    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8081/histenvoi')
        .then(response => response.json())
        .then(data => setHistoricalData(data))
        .catch(error => console.error('Error fetching data:', error));
    };

    fetchData(); 

    const intervalId = setInterval(fetchData, 5000); 

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    setFilteredData(historicalData); 
  }, [historicalData]);

  const offset = currentPage * itemsPerPage;
  const displayData = filteredData.slice(offset, offset + itemsPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setInputValue(item.Env_num.toString());
    setShowSuggestions(false); 
  };
  

  const handleUpdate = () => {
    if (!selectedItem) {
      return;
    }
  
    let updatedHIst_evenement = '';
    if (selectedItem.HIst_evenement === 'EMA') {
      updatedHIst_evenement = 'ETA';
    } else if (selectedItem.HIst_evenement === 'ETA') {
      updatedHIst_evenement = 'EMG';
    } else {
      // Handle other cases if needed
      return;
    }
  
    const updatedItem = { ...selectedItem, HIst_evenement: updatedHIst_evenement };
    const updatedData = historicalData.map(item =>
      item.Env_num === updatedItem.Env_num ? updatedItem : item
    );
    setHistoricalData(updatedData);
    setSelectedItem(updatedItem);
  
    fetch(`http://localhost:8081/historique/${updatedItem.Env_num}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Env_num: updatedItem.Env_num,
        HIst_evenement: updatedItem.HIst_evenement,
        Hist_date: updatedItem.Hist_date,
        Hist_etat: updatedItem.Hist_etat,
        Hist_agence: updatedItem.Hist_agence,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update');
        }
        toast.success('Historique updated successfully');
      })
      .catch(error => {
        console.error('Error updating historique:', error);
        toast.error('Failed to update');
      });
  };
  
  const isDelivered = selectedItem && selectedItem.HIst_evenement === 'EMG';
  const getNextHIst_evenement = (currentHIst_evenement) => {
    switch (currentHIst_evenement) {
      case 'EMA':
        return 'ETA';
      case 'ETA':
        return 'EMG';
      // Add more cases as needed
      default:
        return 'Distribué';
    }
  };
  

  return (
    <div>
       <div className='status-container'>
        <label>Numéro d'envoi</label>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        {isInputTouched && showSuggestions && inputValue.trim() !== '' && (
          <div className='select-item'>
            <button className='btn' onClick={() => setInputValue('')}>x</button>
            <ul>
              {historicalData
                .filter(item => item.Env_num.toString().startsWith(inputValue))
                .map(item => (
                  <li key={item.Env_num} onClick={() => handleItemClick(item)}>
                    {item.Env_num}: {item.Env_exp} - {item.Env_dest}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      {selectedItem && (
  <div className='selected-item'>
      <p>
      <strong>Numero d'envoi:</strong> {selectedItem.Env_num}
      </p>
      <p>
      <strong>Expediteur:</strong> {selectedItem.Env_exp}
      </p>
      <p>
      <strong>Destinataire:</strong> {selectedItem.Env_dest}
      </p>
      <p>
      <strong>Etat:</strong> {selectedItem.HIst_evenement}
      </p>
      <p>
      <strong>Next Etat:</strong> {getNextHIst_evenement(selectedItem.HIst_evenement)}
      </p>
      <button className={selectedItem.HIst_evenement === 'EMG' ? 'state-update delivered' : 'state-update'} onClick={handleUpdate} disabled={selectedItem.HIst_evenement === 'EMG'}>
        {selectedItem.HIst_evenement === 'EMG' ? 'Distribué' : 'Update'}
      </button>
  </div>
)}
      {selectedItem && (
  <div className='step-chart'>
    <div className={`step-item ${selectedEnvStatus === 'EMA' || selectedEnvStatus === 'ETA' || selectedEnvStatus === 'EMG' ? 'active' : ''}`}>Départ</div>
    <div className='progress-bar' style={{ backgroundColor: selectedEnvStatus === 'ETA' || selectedEnvStatus === 'EMG' ? 'purple' : 'transparent' }}></div>
    <div className={`step-item ${selectedEnvStatus === 'ETA' || selectedEnvStatus === 'EMG' ? 'active' : ''}`}>Tri</div>
    <div className='progress-bar' style={{ backgroundColor: selectedEnvStatus === 'EMG' ? 'purple' : 'transparent' }}></div>
    <div className={`step-item ${selectedEnvStatus === 'EMG' ? 'active' : ''}`}>Distribution</div>
  </div>
)}


      {displayData.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className='status-table'>
          <table>
            <thead>
              <tr>
                <th>Numero d'envoi</th>
                <th>Expediteur</th>
                <th>Destinataire</th>
                <th>Etat</th>
                <th>Date</th>
                <th>Agence</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item) => (
                <tr key={item.Env_num}>
                  <td>{item.Env_num}</td>
                  <td>{item.Env_exp}</td>
                  <td>{item.Env_dest}</td>
                  <td>{item.HIst_evenement === 'EMA'
                    ? 'Agence Postale'
                    : item.HIst_evenement === 'ETA'
                    ? 'Centre de tri'
                    : item.HIst_evenement === 'EMG'
                    ? 'Centre de distribution'
                    : 'Unknown'}</td>
                  <td>{new Date(item.Hist_date).toLocaleDateString()}</td>
                  <td>{item.Hist_agence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ReactPaginate
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={changePage}
        containerClassName={'paginate-status'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        disableInitialCallback={false}
      />
      <ToastContainer />
    </div>
  );
};

export default Status;
