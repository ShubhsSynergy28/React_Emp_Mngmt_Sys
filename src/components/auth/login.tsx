import React, { useState } from 'react';
// import axios from 'axios';
import { motion } from 'framer-motion';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField'; // Import TextField
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/auth/Login.scss'; 
import Cookies from 'js-cookie';
import { useMutation} from '@apollo/client';
import { LOGIN_EMPLOYEE, LOGIN_USER } from '../../constants/mutations';

interface LoginFieldProps {
  [key: string]: string;
  password: string;
}

// interface ApiResponse {
//   employee?: {
//     id: number;
//     name: string;
//   };
//   user?: {
//     username: string;
//   };
//   message: string;
//   access_token?: string;
//   refresh_token?: string;
// }

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [loginFormField, setLoginFormField] = useState<LoginFieldProps>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loginEmployee] = useMutation(LOGIN_EMPLOYEE);
  const [loginUser] = useMutation(LOGIN_USER);


  // const api = axios.create({
  //   baseURL: 'http://127.0.0.1:5000',
  //   withCredentials: true,  // Important for sessions to work
  // });

  const handleLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    let responseData;

    if ('email' in loginFormField) {
      // Admin login using GraphQL
      const { data } = await loginUser({
        variables: {
          uSerLoginData: {
            email: loginFormField.email,
            password: loginFormField.password,
          },
        },
      });

      const userLogin = data?.userLogin;
      responseData = userLogin;

      if (userLogin.access_token) {
        sessionStorage.setItem('access_token', userLogin.access_token);
        Cookies.set('access_token_cookie', userLogin.access_token, { path: '/', expires: 7 });
      }
      if (userLogin.refresh_token) {
        sessionStorage.setItem('refresh_token', userLogin.refresh_token);
        Cookies.set('refresh_token_cookie', userLogin.refresh_token, { path: '/', expires: 7 });
      }
      if (userLogin.user?.username) {
        sessionStorage.setItem('name', userLogin.user.username);
      }
      sessionStorage.setItem('role', 'admin');
    } else {
      // Employee login using GraphQL
      const { data } = await loginEmployee({
        variables: {
          employeeLoginData: {
            phone_no: loginFormField.phone_no,
            password: loginFormField.password,
          },
        },
      });

      const empLogin = data?.employeeLogin;
      responseData = empLogin;

      if (empLogin.access_token) {
        sessionStorage.setItem('access_token', empLogin.access_token);
        Cookies.set('access_token_cookie', empLogin.access_token, { path: '/', expires: 7 });
      }
      if (empLogin.refresh_token) {
        sessionStorage.setItem('refresh_token', empLogin.refresh_token);
        Cookies.set('refresh_token_cookie', empLogin.refresh_token, { path: '/', expires: 7 });
      }
      if (empLogin.employee?.id) {
        sessionStorage.setItem('employee_id', empLogin.employee.id.toString());
        Cookies.set('employee_id_cookie', empLogin.employee.id.toString(), { path: '/', expires: 7 });
      }
      if (empLogin.employee?.name) {
        sessionStorage.setItem('name', empLogin.employee.name);
      }
      sessionStorage.setItem('role', 'employee');
    }

    showSnackbar(responseData.message, 'success');
    setTimeout(() => navigate('/'), 1500);

  } catch (err: any) {
    // console.error('Login error:', err);
    const errorMessage = err?.message || 'Login failed. Please check your credentials.';
    showSnackbar(errorMessage, 'error');
  } finally {
    setIsLoading(false);
  }
};


  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleNameFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    const isPhoneNumber = /^\d+$/.test(value);
    const newField = isPhoneNumber ? 'phone_no' : 'email';

    const newState: LoginFieldProps = { password: loginFormField.password };
    newState[newField] = value;
    setLoginFormField(newState);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormField(prev => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const currentFieldName = loginFormField.phone_no !== undefined ? 'phone_no' : 'email';

  return (
    <div className="login-background">
      <div className="floating-element element-1"></div>
      <div className="floating-element element-2"></div>
      <div className="floating-element element-3"></div>

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="login-card"
          whileHover={{ scale: 1.001 }}
        >
          <motion.h2 
            className="head-title-for-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Login
          </motion.h2>

          <form onSubmit={handleLoginFormSubmit} className="login-form">
            <motion.div 
              className="login-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label htmlFor="username">Username</label>
              <TextField
                type="text"
                name={currentFieldName}
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={handleNameFieldChange}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </motion.div>

            <motion.div 
              className="login-form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label htmlFor="password">Password</label>
              <TextField
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={loginFormField.password}
                onChange={handlePasswordChange}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </motion.div>

            <motion.button 
              type="submit" 
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="login-button"
            >
              {isLoading ? (
                <span className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }} 
          >
            {snackbarMessage}
          </Alert>
        </motion.div>
      </Snackbar>
    </div>
  );
};

export default Login;
