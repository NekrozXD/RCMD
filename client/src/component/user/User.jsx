import React, { useEffect, useState } from "react";
import axios from "axios";
import './user.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function User({ lightMode })  {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [formData, setFormData] = useState({
    Us_nom: "",
    Us_matricule: "",
    Us_login: "",
    Us_mail: "",
    Us_pwd: "",
    Fo_id: 0,
    Grp_code: 0,
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8081/utilisateur")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Error fetching data:", err));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  
  const mapFoIdToText = (foId) => {
    switch (foId) {
      case 1:
        return "admin";
      case 2:
        return "saisie";
      case 3:
        return "verifs";
      default:
        return "Unknown";
    }
  };
  
  

  const handleAddUser = async () => {
    try {
      const res = await axios.post("http://localhost:8081/utilisateur", formData);
      console.log("User added successfully:", res.data);
      
      setUsers([...users, res.data]);
     
      setFormData({
        Us_nom: "",
        Us_matricule: "",
        Us_login: "",
        Us_mail: "",
        Us_pwd: "",
        Fo_id: "" ,
        Grp_code: "" ,
      });
     
      fetchData(); 
      toast.info('🦄utiisateur added succesfully!', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "green",
          color: "black",
          fontWeight: "bold"
        },
      });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [users]);

  const handleDeleteUser = (id) => {
    const deleteUserUrl = `http://localhost:8081/utilisateur/${id}`;
    console.log('Deleting user at:', deleteUserUrl);
  
    axios
      .delete(deleteUserUrl)
      .then(() => {
        const updatedUsers = users.filter((user) => user.Us_id !== id);
        setUsers(updatedUsers);
      })
      .catch((err) => console.log("Error deleting user:", err));
      toast.info('🦄 user deleted succesfully!', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "red",
          color: "white",
          fontWeight: "bold"
        },
      });
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setLoggedInUser(parsedUser);
    }
  }, []);

  

  return (
    <div className={`custom-config-container ${lightMode ? 'light-mode' : ''}`}>
      <div className="custom-form-container">
        <form>
          <div className="custom-form-element">
            <label htmlFor="Us_nom" className="custom-label">
              User Name
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_nom"
              name="Us_nom"
              value={formData.Us_nom}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Us_matricule" className="custom-label">
              Matricule
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_matricule"
              name="Us_matricule"
              value={formData.Us_matricule}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Us_login" className="custom-label">
              Login
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_login"
              name="Us_login"
              value={formData.Us_login}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Us_mail" className="custom-label">
              Email
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_mail"
              name="Us_mail"
              value={formData.Us_mail}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Us_pwd" className="custom-label">
              Password
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_pwd"
              name="Us_pwd"
              value={formData.Us_pwd}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
          <div className="custom-form-element">
  <label htmlFor="Fo_id" className="custom-label">
    Fonction
  </label>
  <select
    id="Fo_id"
    name="Fo_id"
    value={formData.Fo_id}
    onChange={handleInputChange}
    className="custom-select"
  >
    <option value= "0">select Fonction</option>-ta
    <option value="1">admin</option>
    <option value="2">saisie</option>
    <option value="3">verifs</option>
  </select>
</div>

</div>

<div className="custom-form-element">
  <label htmlFor="Grp_code" className="custom-label">
    Group_code
  </label>
  <input
    type="text"
    className="custom-input"
    id="Grp_code"
    name="Grp_code"
    value={formData.Grp_code}
    onChange={handleInputChange}
  />
</div>


          <button type="button" className="custom-primary-button" onClick={handleAddUser}>
            Add User
          </button>
        </form>
      </div>

      <div className="custom-list-container">
        <h2>Liste des Utilisateurs</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Matricule</th>
              <th>Login</th>
              <th>Email</th>
              <th>Fonction</th>
              <th>Grp_code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.Us_id}>
                <td>{user.Us_nom}</td>
                <td>{user.Us_matricule}</td>
                <td>{user.Us_login}</td>
                <td>{user.Us_mail}</td>
                <td>{mapFoIdToText(user.Fo_id)}</td>
                <td>{user.Grp_code}</td>
                <td>
                  {loggedInUser && user.Us_id === loggedInUser.Us_id ? (
                    <span>Logged In</span>
                  ) : (
                    <button
                      className="custom-delete-button"
                      onClick={() => handleDeleteUser(user.Us_id)}
                    >
                      Delete
                    </button>
                  )}
                </td> 
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    </div>
  );
}

export default User;
