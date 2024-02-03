import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HistoriqueInput = () => {
  const [envNum, setEnvNum] = useState('');
  const [histEvenement, setHistEvenement] = useState('');
  const [histDate, setHistDate] = useState('');
  const [histEtat, setHistEtat] = useState('');
  const [histAgence, setHistAgence] = useState('');

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSendHistorique = async () => {
    try {
      const historiqueData = {
        Env_num: envNum,
        HIst_evenement: histEvenement,
        Hist_date: histDate,
        Hist_etat: histEtat,
        Hist_agence: histAgence,
      };

      const response = await fetch('http://localhost:8081/historique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historiqueData),
      });

      if (!response.ok) {
        console.error('Failed to send historique data:', response);
        return;
      }
      toast.success('envoye')
      console.log('Historique data sent successfully');
      // Optionally, you can reset input fields after successful submission.
    } catch (error) {
      console.error('Error sending historique data:', error);
    }
  };

  return (
    <div>
      <h2>Historique Input</h2>
      <div>
        <label>Env_num:</label>
        <input type="text" value={envNum} onChange={handleInputChange(setEnvNum)} />
      </div>
      <div>
        <label>HIst_evenement:</label>
        <input type="text" value={histEvenement} onChange={handleInputChange(setHistEvenement)} />
      </div>
      <div>
        <label>Hist_date:</label>
        <input type="text" value={histDate} onChange={handleInputChange(setHistDate)} />
      </div>
      <div>
        <label>Hist_etat:</label>
        <input type="text" value={histEtat} onChange={handleInputChange(setHistEtat)} />
      </div>
      <div>
        <label>Hist_agence:</label>
        <input type="text" value={histAgence} onChange={handleInputChange(setHistAgence)} />
      </div>
      <button onClick={handleSendHistorique}>Send Historique</button>
      <ToastContainer />
    </div>
  );
};

export default HistoriqueInput;
