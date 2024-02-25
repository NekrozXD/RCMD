import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { debounce } from 'lodash';
import './Status.css';

const Status = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); // Define itemsPerPage here
  const [filteredData, setFilteredData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8081/histenvoi')
        .then(response => response.json())
        .then(data => setHistoricalData(data))
        .catch(error => console.error('Error fetching data:', error));
    };

    fetchData(); // Fetch data initially

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    setFilteredData(historicalData); // Initially set filteredData to historicalData
  }, [historicalData]);

  const offset = currentPage * itemsPerPage;
  const displayData = filteredData.slice(offset, offset + itemsPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    const searchResults = historicalData.filter(item => item.Env_num.toString().includes(value));
    setSearchResult(searchResults);
  };

  return (
    <div>
      <div className='status-container'>
        <label>Numéro d'envoi</label>
        <input type="text" onChange={handleSearch} />
        {searchResult.length > 0 && (
          <ul>
            {searchResult.map(item => (
              <li key={item.Env_num}>
                {item.Env_num}: {item.Env_exp} - {item.Env_dest}
              </li>
            ))}
          </ul>
        )}
      </div>
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
                  <td>
                    {item.HIst_evenement === 'EMA'
                      ? 'Agence Postale'
                      : item.HIst_evenement === 'ETA'
                      ? 'Centre de tri'
                      : item.HIst_evenement === 'EMG'
                      ? 'Centre de distribution'
                      : 'Unknown'}
                  </td>
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
    </div>
  );
};

export default Status;
