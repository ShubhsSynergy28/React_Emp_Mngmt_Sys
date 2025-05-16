import React from 'react';
import { motion } from 'framer-motion';
import '../../assets/styles/common/Navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { EMPLOYEE_LOGOUT, USER_LOGOUT } from '../../constants/mutations'; // Adjust path as needed


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [logoutEmployee] = useMutation(EMPLOYEE_LOGOUT);
  const [logoutUser] = useMutation(USER_LOGOUT);

  const handleLogout = async () => {
  try {
    const role = sessionStorage.getItem('role');
    const accessToken = sessionStorage.getItem('access_token');

    if (!accessToken) {
      // console.error('Access token is missing.');
      return;
    }

    if (role === 'admin') {
      await logoutUser({
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });
    } else {
      await logoutEmployee({
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });
    }

    // Clear all stored data and navigate to login
    sessionStorage.clear();
    Cookies.remove('access_token_cookie', { path: '/' });
    Cookies.remove('refresh_token_cookie', { path: '/' });
    Cookies.remove('employee_id', { path: '/' });

    navigate('/auth/login');

  } catch (error) {
    // console.error('An error occurred during logout:', error);
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
