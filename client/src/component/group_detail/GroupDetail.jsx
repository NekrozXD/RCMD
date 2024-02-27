import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Group.css';
import ReactPaginate from 'react-paginate';

const getBaseUrl = () => {
  const { hostname, protocol } = window.location;
  return `${protocol}//${hostname}:8081/`; // Assuming backend is always on port 8081
};

const API_URL = getBaseUrl();

const GroupDetail = ({ selectedGroup, onClose }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const pagesVisited = pageNumber * itemsPerPage;

  useEffect(() => {
    if (selectedGroup) {
      axios
        .get(`${API_URL}benefs`)
        .then((response) => {
          const filteredBeneficiaries = response.data.filter(
            (beneficiary) => beneficiary.Grp_code === selectedGroup.Grp_code
          );
          setBeneficiaries(filteredBeneficiaries);
          setError(null);
        })
        .catch((error) => {
          console.error('Error fetching beneficiaries:', error);
          setError('Error fetching beneficiaries. Please try again.');
        });
    }
  }, [selectedGroup]);

  const displayBeneficiaries = beneficiaries
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((beneficiary) => (
      <tr key={beneficiary.Ben_id}>
        <td>{beneficiary.Ben_id}</td>
        <td>{beneficiary.Ben_Nom}</td>
        <td>{beneficiary.Ben_Addresse}</td>
        <td>{beneficiary.Ben_code}</td>
      </tr>
    ));

  const pageCount = Math.ceil(beneficiaries.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className='detail-container'>
      <div className='detail-div'>
        <h2>{selectedGroup.Grp_nom}</h2>
        <p>Code: {selectedGroup.Grp_code}</p>
        <p>Address: {selectedGroup.Grp_adresse}</p>
      </div>
      <h2 className='benefs'>beneficiaires :</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className='table'>
          <table >
            <thead>
              <tr>
                <th>num</th>
                <th>Name</th>
                <th>Address</th>
                <th>code</th>
              </tr>
            </thead>
            <tbody>{displayBeneficiaries}</tbody>
          </table>  
        </div>
      )}
      <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'} 
            disableInitialCallback = {false}
          />
      <button className='close-btn' onClick={onClose}>
        Fermer
      </button>
    </div>
  );
};

export default GroupDetail;
