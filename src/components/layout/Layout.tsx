import React, { useEffect, useState } from 'react';
import '../../assets/styles/Layout.scss';
import { Outlet, useNavigate } from 'react-router-dom';
// import Navbar from '../common/Navbar';
// import Footer from '../common/Footer';
import { RoleProvider } from '../../utils/RoleContext';
// import Cookies from 'js-cookie';

const Layout = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  // const user_id = Cookies.get('user_id');
  useEffect(() => {
    const access_token = sessionStorage.getItem('access_token');
    const userRole = sessionStorage.getItem('role');
    if (!access_token) {
      navigate('/auth/login');
    } else {
      setRole(userRole);
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'employee') {
        navigate('/employee');
      }
    }
  }, [navigate]);

  return (
    <>
      {/* <Navbar /> */}
      <RoleProvider role={role}>
        <Outlet />
      </RoleProvider>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;