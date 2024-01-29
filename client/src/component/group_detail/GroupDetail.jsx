import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Group.css'

const GroupDetail = ({ selectedGroup, onClose }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
 
    if (selectedGroup) {
     
      axios.get(`http://localhost:8081/benefs`)
        .then((response) => {
         
          const filteredBeneficiaries = response.data.filter(
            (beneficiary) => beneficiary.Grp_code === selectedGroup.Grp_code
          );
          setBeneficiaries(filteredBeneficiaries);
        })
        .catch((error) => {
          console.error('Error fetching beneficiaries:', error);
        });
    }
  }, [selectedGroup]);

  return (
    <div className='detail-container'>
      <div className='detail-div'>
      <h2>{selectedGroup.Grp_nom}</h2>
      <p>Code: {selectedGroup.Grp_code}</p>
      <p>Address: {selectedGroup.Grp_adresse}</p>
      </div>
      <h2>Beneficiaries:</h2>
      <div>
      <table className='table'>
        <thead>
          <tr>
            <th>num</th>
            <th>Name</th>
            <th>Adress</th>
            <th>code</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((beneficiary) => (
            <tr key={beneficiary.Ben_id}>
              <td>{beneficiary.Ben_id}</td>
              <td>{beneficiary.Ben_Nom}</td>
              <td>{beneficiary.Ben_Addresse}</td>
              <td>{beneficiary.Ben_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button className = "close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default GroupDetail;
