import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../login';
import { MockedProvider } from '@apollo/client/testing';
import { LOGIN_EMPLOYEE, LOGIN_USER } from '../../../constants/mutations';
import Cookies from 'js-cookie';
import { MemoryRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock js-cookie
jest.mock('js-cookie', () => ({
  set: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByLabelText(/Username/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Login/i })).toBeDefined();
  });

  it('updates email and password fields and submits admin login', async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_USER,
          variables: {
            uSerLoginData: {
              email: 'admin@example.com',
              password: 'adminpass',
            },
          },
        },
        result: {
          data: {
            userLogin: {
              access_token: 'admin_token',
              refresh_token: 'refresh_token',
              user: {
                username: 'adminUser',
              },
              message: 'Admin login successful',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'adminpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem('access_token')).toBe('admin_token');
      expect(sessionStorage.getItem('name')).toBe('adminUser');
      expect(sessionStorage.getItem('role')).toBe('admin');
      // expect(Cookies.set).toHaveBeenCalledWith('access_token_cookie', 'admin_token', expect.any(Object));
      // expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('updates phone_no and password fields and submits employee login', async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_EMPLOYEE,
          variables: {
            employeeLoginData: {
              phone_no: '1234567890',
              password: 'employeepass',
            },
          },
        },
        result: {
          data: {
            employeeLogin: {
              access_token: 'employee_token',
              refresh_token: 'refresh_token',
              employee: {
                id: 42,
                name: 'John Doe',
              },
              message: 'Employee login successful',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'employeepass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem('access_token')).toBe('employee_token');
      expect(sessionStorage.getItem('name')).toBe('John Doe');
      expect(sessionStorage.getItem('employee_id')).toBe('42');
      expect(sessionStorage.getItem('role')).toBe('employee');
      // expect(Cookies.set).toHaveBeenCalledWith('access_token_cookie', 'employee_token', expect.any(Object));
      // expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error snackbar on login failure', async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_USER,
          variables: {
            uSerLoginData: {
              email: 'wrong@example.com',
              password: 'wrongpass',
            },
          },
        },
        error: new Error('Invalid credentials'),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeDefined();
    });
  });
});
