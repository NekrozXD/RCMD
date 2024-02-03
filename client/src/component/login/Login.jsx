import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showInputError, setShowInputError] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    console.log('Handle Login Clicked');
    try {
      setShowInputError(false);
  
      if (!email || !password) {
        setShowInputError(true);
        return;
      }
  
      if (event.key === 'Enter' || event.type === 'click') {
        event.preventDefault();
  
        // Check if login is already in progress
        if (loginInProgress) {
          return;
        }
  
        setLoginInProgress(true); // Set login in progress
  
        const usersResponse = await fetch('http://localhost:8081/utilisateur');
        const usersData = await usersResponse.json();
  
        const user = usersData.find(
          (user) => user.Us_login === email && user.Us_pwd === password
        );
  
        if (user) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          setLoggedInUser(user);
  
          toast.success('Login successful', {
            position: 'top-left',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
  
          // Use Promise to wait for the toast to be closed
          await new Promise(resolve => setTimeout(resolve, 2000));
  
          if (user.Fo_id === 1) {
            navigate(`/main/${user.Us_matricule}`);
          } else if (user.Fo_id === 2) {
            navigate('/saisie');
          }
        } else {
          toast.error('Login failed. Please check your credentials or user privileges.', {
            position: 'top-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setShowErrorPopup(true);
    } finally {
      setLoginInProgress(false); 
    }
  };
  
  
  
  useEffect(() => {
    console.log('showErrorPopup:', showErrorPopup);
    console.log('showSuccessPopup:', showSuccessPopup);
    console.log('loggedInUser:', loggedInUser);
  
    const timeoutId = setTimeout(() => {
      setShowErrorPopup(false);
      setShowSuccessPopup(false);
  
      if (!showErrorPopup && showSuccessPopup && loggedInUser) {
        if (loggedInUser.Fo_id === 1) {
          navigate(`/main/${loggedInUser.Us_matricule}`, {
            state: { loggedInUser: loggedInUser },
          });
        } else if (loggedInUser.Fo_id === 2) {
          navigate('/saisie');
        } 
      }
    }, 3000);
  
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showErrorPopup, showSuccessPopup, loggedInUser, navigate]);
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='main-container'>
      <div className='login-container'>
        <div className='login-section'>
          <div className='about-image'></div>
          <h2>LOGIN</h2>
          <input
            placeholder={`Login${showInputError ? ' - veuillez remplir ce champ' : ''}`}
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={showInputError ? 'input-error' : ''}
            onKeyPress={handleLogin}
          />
          <br />
          <input
            placeholder={`Password${
              showInputError ? ' - veuillez remplir ce champ' : ''
            }`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={showInputError ? 'input-error' : ''}
            onKeyPress={handleLogin}
          />
          <br />
          <p className='hide-show' type='button' onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </p>
          <br />
          <button type='submit' className='login-btn' onClick={handleLogin}>
            LOGIN
          </button>

          
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
