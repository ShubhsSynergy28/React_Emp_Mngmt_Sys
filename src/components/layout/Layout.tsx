import React, { useEffect, useState } from 'react';
import '../../assets/styles/Layout.scss';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { RoleProvider } from '../../utils/RoleContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const access_token = sessionStorage.getItem('access_token');
    const userRole = sessionStorage.getItem('role');

    if (!access_token) {
      navigate('/auth/login');
    } else {
      setRole(userRole);

      // Prevent redirection if already on a valid route
      if (userRole === 'admin' && !location.pathname.startsWith('/admin')) {
        navigate('/admin');
      } else if (userRole === 'employee' && !location.pathname.startsWith('/employee')) {
        navigate('/employee');
      }
    }
  }, [navigate, location.pathname]); // Add location.pathname as a dependency

  return (
    <>
      <RoleProvider role={role}>
        <Outlet />
      </RoleProvider>
    </>
  );
};

export default Layout;