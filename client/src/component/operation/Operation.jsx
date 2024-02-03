import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Operation.css';

const Operation = ({ lightMode }) => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/histEnvoi');
        setHistoricalData(response.data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchData();
  }, []);

  const triData = historicalData.filter(item => item.HIst_evenement === 'ETA');
  const triEnv = historicalData.filter(item => item.HIst_evenement === 'EMA');
  const triDist = historicalData.filter(item => item.HIst_evenement === 'EMG');

  return (
    <div className={`operation-container ${lightMode ? 'light-mode' : ''}`}>
     <div className='operation-list'>
          <table>
            <thead>
              <tr>
                <th>Env_num</th>
                <th>Expediteur</th>
                <th>Destinataire</th>
                <th>Etat</th>
                <th>Hist_date</th>
                <th>Hist_agence</th>
              </tr>
            </thead>
            <tbody>
              {historicalData.map((item) => (
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
