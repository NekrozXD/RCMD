import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import _ from 'lodash'; 
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Operation.css';

const Operation = ({ lightMode }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchDay, setSearchDay] = useState('');
  const [searchMonth, setSearchMonth] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce the update function with a delay of 200ms
  const delayedSetHistoricalData = _.debounce(setHistoricalData, 200);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8082');
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      console.log('Received data from server:', event.data);

      delayedSetHistoricalData(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Connection to WebSocket server closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  
  
  
  const handleSearch = () => {
    return historicalData.filter(item => {
      const itemDate = new Date(item.Hist_date);
      const itemDay = itemDate.getDate().toString();
      const itemMonth = (itemDate.getMonth() + 1).toString();
      const itemYear = itemDate.getFullYear().toString();

      const isDateMatched =
        (searchDay === '' || itemDay === searchDay) &&
        (searchMonth === '' || itemMonth === searchMonth) &&
        (searchYear === '' || itemYear === searchYear);

      const isSearchQueryMatched = searchQuery === '' || 
        Object.values(item).some(val => val.toString().toLowerCase().includes(searchQuery.toLowerCase()));

      return isDateMatched && isSearchQueryMatched;
    });
  };

  const itemsPerPage = 9;
  const filteredData = handleSearch();
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const displayData = filteredData.slice(offset, offset + itemsPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const resetPagination = () => {
    setCurrentPage(0);
  };
  const triData = historicalData.filter(item => item.HIst_evenement === 'ETA');
const triEnv = historicalData.filter(item => item.HIst_evenement === 'EMA');
const triDist = historicalData.filter(item => item.HIst_evenement === 'EMG');


  return (
    <div className={`operation-container ${lightMode ? 'light-mode' : ''}`}>
      <h1 className='operation-head'>Opération</h1>
      <div className="search-bar-container">
        <label>Jour:</label>
        <span>&nbsp;</span>
        <input
          type="text"
          placeholder="..."
          value={searchDay}
          onChange={(e) => { setSearchDay(e.target.value); resetPagination(); }}
        />
        <label>Mois:</label>
        <span>&nbsp;</span>
        <input
          type="text"
          placeholder="..."
          value={searchMonth}
          onChange={(e) => { setSearchMonth(e.target.value); resetPagination(); }}
        />
        <label>Année:</label>
        <span>&nbsp;</span>
        <input
          type="text"
          placeholder="..."
          value={searchYear}
          onChange={(e) => { setSearchYear(e.target.value); resetPagination(); }}
        />
        <input
          type="text"
          placeholder="..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); resetPagination(); }}
          className="large-input"
        />

        <button onClick={() => console.log('Search button clicked')}>Search</button>
      </div>
      <div className='operation-list'>
        <table>
        <thead style={{ position: 'sticky', top: 0, zIndex: 1}}>
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
      <div>
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={changePage}
          containerClassName={'paginate'}
          activeClassName={'active'}
          pageClassName={'page-item'} 
          disableInitialCallback={false}
        />
      </div>

      <div className='side-hist'>
        <div className='recap'>
          <h2>Colis : </h2>
          <div className='nbr-envoi'>
            <p>Nombre d'envoi</p>
            <h1>{historicalData.length}</h1>
          </div>
          <div className='nbr-env'>
            <p>à l' agence postale</p>
            <h1>{triEnv.length}</h1>
          </div>
          <div className='nbr-tri'>
            <p>au centre de tri</p>
            <h1>{triData.length}</h1>
          </div>
          <div className='nbr-dist'>
            <p>centre de distribution</p>
            <h1>{triDist.length}</h1>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Operation;
