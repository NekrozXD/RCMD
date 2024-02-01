import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Agence({ onDetailClick }) {
  const [agences, setAgences] = useState([]);
  const [selectedAgenceId, setSelectedAgenceId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    Agence_nom: "",
    Agence_code: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchData = () => {
    axios
      .get("http://localhost:8081/agence")
      .then((res) => setAgences(res.data))
      .catch((err) => console.log("Error fetching data:", err));
  };

  const handleAddAgence = () => {
    axios.post("http://localhost:8081/agence", formData)
      .then((res) => {
        console.log("Agence added successfully:", res.data);
        setAgences([...agences, res.data]);
        setFormData({
          Agence_nom: "",
          Agence_code: "",
        });
        toast.success('Agence ajoutée avec succès');
        fetchData();
      })
      .catch((err) => {
        console.error("Error adding agence:", err);
      });
  };


  useEffect(() => {
    fetchData();
  }, [agences]);

  const handleDeleteAgence = (agence) => {
    console.log("Received agence for deletion:", agence);
  
    if (!agence || !agence.agence_Id) {
      console.error("Invalid agence object:", agence);
      return;
    }
  
    console.log("Deleting Agence with ID:", agence.agence_Id);
  
    axios
      .delete(`http://localhost:8081/agence/${agence.agence_Id}`)
      .then(() => {
        const updatedAgences = agences.filter((a) => a.agence_Id !== agence.agence_Id);
        setAgences(updatedAgences);
        toast.error('Agence supprimée');
      })
      .catch((err) => console.log("Error deleting agence:", err));
  };

  const handleUpdateAgence = () => {
    console.log("Selected Agence Id:", selectedAgenceId);
  
    if (!selectedAgenceId) {
      console.error("No agence selected for update");
      return;
    }
  
    axios.put(`http://localhost:8081/agence/${selectedAgenceId}`, formData)
      .then((res) => {
        console.log("Agence updated successfully:", res.data);
        fetchData();
        setFormData({
          Agence_nom: "",
          Agence_code: "",
        });
        toast.info('Agence mis à jour');
        setSelectedAgenceId(null);
        setIsEditing(false); 
      })
      .catch((err) => {
        console.error("Error updating agence:", err);
      });
  };

  const handleEditAgence = (agence) => {
    console.log("Editing agence:", agence);
    setFormData({
      Agence_nom: agence.Agence_nom,
      Agence_code: agence.Agence_code,
    });
    setSelectedAgenceId(agence.agence_Id);
    setIsEditing(true); 
  };

  const handleClear = (e) => {
    e.preventDefault();
      setIsEditing(false);
      setFormData({
        Agence_nom: "",
        Agence_code: "",
      });
  }

  const showDetail = (agence) => {
    onDetailClick(agence);
  };

  return (
    <div className="main-agence-container">
        <div className="input-agence-container">
            <form>
            <h1>{isEditing ? "Modifier Agence" : "Nouvelle agence"}</h1>
            <button type="button"  onClick={handleClear}>
              Clear
            </button>
            <div>
                <input
                placeholder="Nom de l'agence" 
                type="text"
                id="Agence_nom"
                name="Agence_nom"
                value={formData.Agence_nom}
                onChange={handleInputChange}
                />
            </div>

            <div>
                <input
                placeholder="Code de l'agence"
                type="text"
                id="Agence_code"
                name="Agence_code"
                value={formData.Agence_code}
                onChange={handleInputChange}
                />
            </div>

            {isEditing ? (
              <button type="button" className="change" onClick={handleUpdateAgence}>
                Mettre à jour Agence
              </button>
            ) : (
              <button type="button" className="change" onClick={handleAddAgence}>
                Ajouter Agence
              </button>
            )}
            </form>
        </div>

        
        <div className="agence-list-container">
            <h2>Liste des Agences</h2>
            <table>
            <thead>
                <tr>
                <th>Nom</th>
                <th>Code</th>
                <th>Action</th>
                <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {agences.map((agence) => (
                <tr key={agence.agence_Id}>
                    <td>{agence.Agence_nom}</td>
                    <td>{agence.Agence_code}</td>
                    <td>
                    <div className="button-container">
                        <button  className="custom-delete-button" onClick={() => handleDeleteAgence(agence)}>Delete</button>
                        <button onClick={() => handleEditAgence(agence)}>Edit</button>
                    </div>
                    </td>
                    <td>
                    <div className="button-container">
                    <button onClick={() => showDetail(agence)}>
                        Details
                    </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <ToastContainer />
    </div>
  );
}

export default Agence;
