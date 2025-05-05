import React from 'react';
import { motion } from 'framer-motion';
import '../../assets/styles/common/Navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const role = sessionStorage.getItem('role');
      const accessToken = sessionStorage.getItem('access_token'); // Retrieve the access token
      let response;

      if (!accessToken) {
        console.error('Access token is missing.');
        return;
      }

      if (role === 'admin') {
        response = await axios.post(
          import.meta.env.VITE_ADMIN_LOGOUT,
          {}, // No body needed
          {
            withCredentials: true, // Include cookies in the request
            headers: {
              Authorization: `Bearer ${accessToken}`, // Add the access token as a Bearer token
            },
          }
        );
      } else {
        response = await axios.post(
          import.meta.env.VITE_EMPLOYEE_LOGOUT,
          {}, // No body needed
          {
            withCredentials: true, // Include cookies in the request
            headers: {
              Authorization: `Bearer ${accessToken}`, // Add the access token as a Bearer token
            },
          }
        );
      }

      if (response.status === 200) {
        // Clear session storage and redirect to login
        sessionStorage.clear();
        Cookies.remove('access_token_cookie', { path: '/' });
        Cookies.remove('refresh_token_cookie', { path: '/' });
        Cookies.remove('employee_id',{path: '/'});

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
        <Link to={'/'}>
        <h1 className="navbar-title">Employee Management</h1>
        </Link>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </motion.nav>
    </>
  );
};

export default Navbar;
