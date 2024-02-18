import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showInputError, setShowInputError] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent default scroll behavior

        // Find all focusable elements in the document
        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const currentIndex = Array.from(focusableElements).findIndex(element => element === document.activeElement);

        let nextIndex;
        if (event.key === 'ArrowDown') {
          nextIndex = currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1;
        } else {
          nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        }

        // Shift focus to the next or previous focusable element
        focusableElements[nextIndex].focus();
      }
    };

    // Add event listener for keydown
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount


  const handleLogin = async (event) => {
    try {
      console.log('Attempting login...');
      event.preventDefault();
  
      // Disable the login button to prevent multiple login attempts
      setLoginInProgress(true);
  
      setShowInputError(false);
  
      if (!email || !password) {
        setShowInputError(true);
        console.log('Empty email or password, returning...');
        // Re-enable the login button before returning
        setLoginInProgress(false);
        return;
      }
  
      console.log('Fetching user data...');
  
      const usersResponse = await fetch('http://localhost:8081/utilisateur');
      const usersData = await usersResponse.json();
  
      console.log('Users data:', usersData);
  
      const user = usersData.find(
        (user) => user.Us_login === email && user.Us_pwd === password
      );
  
      if (user) {
        console.log('Login successful:', user);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        toast.success('Login successful', {
          position: 'top-left',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          onClose: () => {
            if (user.Fo_id === 1) {
              navigate(`/main/${user.Us_matricule}`);
            } else if (user.Fo_id === 2) {
              navigate('/saisie');
            }
          }
        });
      } else {
        console.log('Login failed. User not found.');
        toast.error('Login failed. Please check your credentials or user privileges.', {
          position: 'top-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setTimeout(() => {
        setLoginInProgress(false);
        console.log('Login process completed.');
      }, 4000); 
    }
  };
  
  

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
            onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)} // Trigger login on Enter key
            disabled={loginInProgress} // Disable input during login
          />
          <br />
          <input
            placeholder={`Password${showInputError ? ' - veuillez remplir ce champ' : ''}`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={showInputError ? 'input-error' : ''}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)} // Trigger login on Enter key
            disabled={loginInProgress} // Disable input during login
          />
          <br />
          <p className='hide-show' type='button' onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </p>
          <br />
          <button type='submit' className='login-btn' onClick={handleLogin} disabled={loginInProgress}>
            {loginInProgress ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'LOGIN'}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
