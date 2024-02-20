import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './Config.css'; 

function Configuration(props) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const [formData, setFormData] = useState({
    Grp_nom: "",
    Grp_code: "",
    Grp_adresse: "",
    Grp_responsable: "",
    Grp_contact: "",
    Grp_type: "",
    Grp_mail: "",
  }); 

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); 

        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const currentIndex = Array.from(focusableElements).findIndex(element => element === document.activeElement);

        let nextIndex;
        if (event.key === 'ArrowDown') {
          nextIndex = currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1;
        } else {
          nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        }


        focusableElements[nextIndex].focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClear = () => {
    setFormData({
      Grp_nom: "",
      Grp_code: "",
      Grp_adresse: "",
      Grp_responsable: "",
      Grp_contact: "",
      Grp_type: "",
      Grp_mail: "",
    });
    toast.info('cleared',{
      closeButton: false,
      closeOnClick: false,
      autoClose: 3000, 
    });
    setIsEditing(false)
  }

  const fetchData = () => {
    const userFromStorage = localStorage.getItem('loggedInUser');
    if (userFromStorage) {
      const loggedInUser = JSON.parse(userFromStorage);
      console.log('Logged In User:', loggedInUser);

      const userGrpCode = loggedInUser.Grp_code;
      console.log('User Grp_code:', userGrpCode);

      axios
        .get("http://localhost:8081/groupement")
        .then((res) => {
          console.log('All Groups:', res.data);

          const userGroups = res.data.filter((group) => {
            console.log('Group Grp_code:', group.Grp_code);
            return group.Grp_code === userGrpCode.toString();  
          });

          console.log('User Groups:', userGroups);
          setGroups(userGroups);
          setIsEditing(false)
        })
        .catch((err) => console.log("Error fetching data:", err));
    }
  };

  const handleAddGroup = () => {
    axios.post("http://localhost:8081/groupement", formData)
      .then((res) => {
        console.log("Group added successfully:", res.data);
        setGroups((prevGroups) => [...prevGroups, res.data]);
        setFormData({
          Grp_nom: "",
          Grp_code: "",
          Grp_adresse: "",
          Grp_responsable: "",
          Grp_contact: "",
          Grp_type: "",
          Grp_mail: "",
        });
        toast.success('group added succesfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.error("Error adding group:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []); 
  
  const handleDeleteGroup = (id) => {
    axios
      .delete(`http://localhost:8081/groupement/${id}`)
      .then(() => {
        const updatedGroups = groups.filter((group) => group.Grp_id !== id);
        setGroups(updatedGroups);
        toast.error('group deleted succesfully')
      })
      .catch((err) => console.log("Error deleting group:", err));
  };

  const handleUpdateGroup = () => {
    if (!selectedGroupId) {
      console.error("No group selected for update");
      return;
    }

    axios.put(`http://localhost:8081/groupement/${selectedGroupId}`, formData)
      .then((res) => {
        console.log("Group updated successfully:", res.data);
        fetchData();
        setFormData({
          Grp_nom: "",
          Grp_code: "",
          Grp_adresse: "",
          Grp_responsable: "",
          Grp_contact: "",
          Grp_type: "",
          Grp_mail: "",
        });
        setSelectedGroupId(null);
        toast.info('group info updated');

      })
      .catch((err) => {
        console.error("Error updating group:", err);
      });
  };

  const handleEditGroup = (group) => {
    setFormData({
      Grp_nom: group.Grp_nom,
      Grp_code: group.Grp_code,
      Grp_adresse: group.Grp_adresse,
      Grp_responsable: group.Grp_responsable,
      Grp_contact: group.Grp_contact,
      Grp_type: group.Grp_type,
      Grp_mail: group.Grp_mail,
    });
    
    setSelectedGroupId(group.Grp_id);
    setIsEditing(true)
  };

  const showDetail = (group) => {
    props.onDetailClick(group);
  };
  
  return (
    <div className="custom-config-container">
      <div className="custom-form-container"> 
        <form>
        <h2>{isEditing ? "Modifier Groupement" : "Nouveau groupement"}</h2>
        <button  type="button" onClick={handleClear}>clear</button>
          <div className="custom-form-element">
            <label htmlFor="Grp_nom" className="custom-label"></label>
            <input
              placeholder="group-name"
              type="text"
              className="custom-input"
              id="Grp_nom"
              name="Grp_nom"
              value={formData.Grp_nom}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Grp_code" className="custom-label"></label>
            <input
              placeholder="code"
              type="text"
              className="custom-input"
              id="Grp_code"
              name="Grp_code"
              value={formData.Grp_code}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_mail" className="custom-label"></label>
            <input
              placeholder="Grp_mail"
              type="text"
              className="custom-input"
              id="Grp_mail"
              name="Grp_mail"
              value={formData.Grp_mail}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_adresse" className="custom-label"></label>
            <input
              placeholder="adresse"
              type="text"
              className="custom-input"
              id="Grp_adresse"
              name="Grp_adresse"
              value={formData.Grp_adresse}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_responsable" className="custom-label"></label>
            <input
              placeholder="responsable"
              type="text"
              className="custom-input"
              id="Grp_responsable"
              name="Grp_responsable"
              value={formData.Grp_responsable}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_contact" className="custom-label"></label>
            <input
              placeholder="contact"
              type="text"
              className="custom-input"
              id="Grp_contact"
              name="Grp_contact"
              value={formData.Grp_contact}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_type" className="custom-label"></label>
            <select
                id="Grp_type"
                name="Grp_type"
                value={formData.Grp_type}
                onChange={handleInputChange}
                className="custom-select"
              >
                <option value= "0">selectioner le type</option>
                <option value="centri">Centri</option>
                <option value="Societe">Societe</option>
                <option value="Agence postale">Agence postale</option>
              </select>
          </div>
          {isEditing ? (
             <button type="button" className="change" onClick={handleUpdateGroup}>
             Mettre à jour
           </button>
          
          ):(
            <button type="button" className="change" onClick={handleAddGroup}>
            Ajouter
          </button>
          )}
        </form>
      </div>

      <div className="custom-list-container">
        <h2>Liste des Groupements</h2>
        <table className="custom-table"> 
          <thead>
            <tr>
              <th>Nom</th>
              <th>Code</th>
              <th>Adresse</th>
              <th>Responsable</th>
              <th>type</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.Grp_id}>
                <td>{group.Grp_nom}</td>
                <td>{group.Grp_code}</td>
                <td>{group.Grp_adresse}</td>
                <td>{group.Grp_responsable}</td>
                <td>{group.Grp_type}</td>
                <td>
                  <div className="button-container">
                    <button
                      className="custom-delete-button"
                      onClick={() => handleDeleteGroup(group.Grp_id)}
                    >
                      Supprimer
                    </button>
                    <button
                      className="custom-edit-button"
                      onClick={() => handleEditGroup(group)}
                    >
                      Modifier
                    </button>
                  </div>
                </td>
                <td>
                  <div className="button-container">
                    <button className="detail-button" onClick={() => showDetail(group)}>
                      Voir liste
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

export default Configuration;
