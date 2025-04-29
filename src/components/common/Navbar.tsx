import React from 'react';
import { motion } from 'framer-motion';
import '../../assets/styles/common/Navbar.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const role = sessionStorage.getItem('role');
      const access_token = sessionStorage.getItem('access_token');
      // const refresh_token = sessionStorage.getItem('refresh_token');
      let response;

      if (role === 'admin') {
        response = await axios.post('http://localhost:5000/logout', {}, {
          withCredentials: true, // Include cookies in the request
          headers: {
            Authorization: `Bearer ${access_token}`, // Add the access token as a Bearer token
          },
        });
        sessionStorage.clear();
      } else {
        response = await axios.post('http://localhost:5000/logout-emp', {}, {
          withCredentials: true, // Include cookies in the request
          headers: {
            Authorization: `Bearer ${access_token}`, // Add the access token as a Bearer token
          },
        });
        sessionStorage.clear();
      }
      
      if (response.status === 200) {
        sessionStorage.clear();
        // Clear session storage and redirect to login
        navigate('/auth/login');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60 }}
        className="navbar"
      >
        <h1 className="navbar-title">Employee Management</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </motion.nav>
    </>
  );
};

export default Navbar;
