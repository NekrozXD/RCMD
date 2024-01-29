import React, { useEffect, useState } from 'react';

const BeneficiaireComponent = () => {
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/combinedData') 
      .then(response => response.json())
      .then(data => {
        console.log('Combined Data:', data);
        setCombinedData(data);
      })
      .catch(error => console.error('Error fetching combined data:', error));
  }, []);
  
  
  return (
    <div>
      <h1>Combined Data</h1>
      {combinedData && combinedData.length > 0 ? (
        <ul>
          {combinedData.map((item, index) => (
            <li key={index}>
              <p>Beneficiaire: {item.Ben_Nom}</p>
              <p>Agence Nom: {item.Agence_nom}</p>
              <p>Addresse : {item.Ben_Addresse}</p>
              <p>groupement : code: {item.Grp_code} <span>&nbsp;</span>nom: {item.Grp_nom}</p>
              <p></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
      };  

export default BeneficiaireComponent;
