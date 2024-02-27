import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './user.css'
import axios from 'axios';
const getBaseUrl = () => {
  const { hostname, protocol } = window.location;
  return `${protocol}//${hostname}:8081/`; 
};

const API_URL = getBaseUrl();


const ModifyUser = (props) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [userData, setUserData] = useState({
    Us_nom: '',
    Us_matricule: '',
    Us_login: '',
    Us_mail: '',
    Us_pwd: '',
    Fo_id: 0,
    Grp_id: 0,
  });

  const back = () => {
    navigate('/main/:usMatricule')
  }
  const fetchData = async () => {
    if (loggedInUser) {
      try {
        // Fetch all user data from the database
        const allUserData = await axios.get(`${API_URL}utilisateur`);
        console.log('Fetched all user data from the database:', allUserData.data);

        // Find the user with the same Us_matricule
        const matchingUser = allUserData.data.find(user => user.Us_matricule === loggedInUser.Us_matricule);

        if (matchingUser) {
          console.log('Found matching user:', matchingUser);
          setUserData(matchingUser);
        } else {
          console.log('User not found');
          // Handle the case where the user is not found, e.g., show an error message
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
        // Handle other errors, e.g., show a generic error message
      }
    }
  };

  useEffect(() => {
    fetchData();
    console.log('Local stored user data:', loggedInUser);
  }, []); 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const loggedInUserId = loggedInUser?.Us_id;
  
    try {
      const response = await axios.put(`${API_URL}utilisateur/${loggedInUserId}`, userData);
      console.log('User information updated successfully:', response.data);
  
      // Update local storage with the new user data
      localStorage.setItem('loggedInUser', JSON.stringify(response.data));
      toast.success('User information updated successfully. Please log in again.');
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  const redirect = () =>{
    navigate("/")
  }
  

  return (
    <div className='modify-container'>
        <div className='user-photo'></div>
        <div className='add-photo'>+</div>
      {userData && (
        <div>
          <h2>{userData.Us_nom}</h2>

          <form>
            <label htmlFor="Us_nom">Nom:</label>
            <input
              type="text"
              id="Us_nom"
              name="Us_nom"
              value={userData.Us_nom}
              onChange={handleInputChange}
            />
            <label>Matricule:</label>
            <input
            type='text'
            id='Us_matricule'
            name='Us_matricule'
            value={userData.Us_matricule}
            onChange={handleInputChange}
            />
            <label > Login:</label>
              <input
            type='text'
            id='Us_login'
            name='Us_login'
            value={userData.Us_login}
            onChange={handleInputChange}
            />
            <label > mail:</label>
              <input
            type='text'
            id='Us_mail'
            name='Us_mail'
            value={userData.Us_mail}
            onChange={handleInputChange}
            />
            <label > password:</label>
              <input
            id='Us_pwd'
            name='Us_pwd'
            value={userData.Us_pwd}
            type={showPassword ? 'text' : 'password'}
            onChange={handleInputChange}
            />
             <p className='hide-show' type='button' onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </p>
            <br></br>
            <br></br>
            <br></br>
            <button type="button" onClick={handleSubmit}>
              Update User Information
            </button>
          </form>
        </div>
      )}
      <br></br>
      <button onClick={redirect}>return to login</button>
      <button className='back' onClick={back}>🔙</button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ModifyUser;
