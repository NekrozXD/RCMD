import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Operation.css';

const Operation = ({ lightMode }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/histEnvoi');
        const newData = response.data;
        setHistoricalData(newData);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };
  
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once
  


  
  const itemsPerPage = 20;
  const pagesVisited = currentPage * itemsPerPage;
  const displayData = historicalData.slice(pagesVisited, pagesVisited + itemsPerPage);

  const pageCount = Math.ceil(historicalData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleSearch = (event) => {
    const searchQuery = event.target.value;
    console.log('Search Query:', searchQuery);
    // You can perform your search logic here
  };

  const triData = historicalData.filter(item => item.HIst_evenement === 'ETA');
  const triEnv = historicalData.filter(item => item.HIst_evenement === 'EMA');
  const triDist = historicalData.filter(item => item.HIst_evenement === 'EMG');

  return (
    <div className={`operation-container ${lightMode ? 'light-mode' : ''}`}>
       <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
      />
      <button onClick={() => console.log('Search button clicked')}>Search</button>
    </div>
      <div className='operation-list'>
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
                <td>
                  {item.HIst_evenement === 'EMA'
                    ? 'Agence Postale'
                    : item.HIst_evenement === 'ETA'
                    ? 'Centre de tri'
                    : item.HIst_evenement === 'EMG'
                    ? 'Centre de distribution'
                    : 'Unknown'}
                </td>
                <td>{item.Hist_date}</td>
                <td>{item.Hist_agence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
      <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={changePage}
          containerClassName={'paginate'}
          activeClassName={'active'}
          pageClassName={'page-item'} 
          disableInitialCallback = {false}
        />       
        </div>
      <div className='side-hist'>
        <div className='recap'>
          <div className='nbr-envoi'>
            <p>Nombre d'envoi</p>
            <h1>{historicalData.length}</h1>
          </div>
          <div className='nbr-env'>
            <p>Colis a l'agence postale</p>
            <h1>{triEnv.length}</h1>
          </div>
          <div className='nbr-tri'>
            <p>colis au centre de tri</p>
            <h1>{triData.length}</h1>
          </div>
          <div className='nbr-dist'>
            <p>Colis au centre de distribution</p>
            <h1>{triDist.length}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operation;
