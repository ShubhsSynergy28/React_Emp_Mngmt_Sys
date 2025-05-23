// import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Viewmydetails from '../Viewmydetails';
import { GET_EMPLOYEE_BY_ID } from '../../../constants/query';

const mockEmployeeId = '123';
const mockEmployeeData = {
  getEmployeebyId: {
    Eid:'123',
    EName: 'John Doe',
    Ephone: '1234567890',
    Ebirth_date: '1990-01-01',
    Egender: 'Male',
    Edescription: 'Senior Developer',
    Efile_path: '',
    educations: ['B.Tech', 'M.Tech'],
    hobbies: ['Reading', 'Gaming'],
    __typename: 'Employee',
  },
};

const mocks = [
  {
    request: {
      query: GET_EMPLOYEE_BY_ID,
      variables: { getEmployeebyIdId: mockEmployeeId },
    },
    result: {
      data: mockEmployeeData,
    },
  },
];

describe('Viewmydetails', () => {
  beforeEach(() => {
    sessionStorage.setItem('employee_id', mockEmployeeId);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders loading state initially', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Viewmydetails />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeDefined()  });

  it('renders employee details after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Viewmydetails />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeDefined();
      expect(screen.getByText(/1234567890/)).toBeDefined();
      expect(screen.getByText(/1990-01-01/)).toBeDefined();
      expect(screen.getByText(/Senior Developer/)).toBeDefined();
    });
  });

  it('renders error message when sessionStorage is empty', async () => {
    sessionStorage.clear();

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <Viewmydetails />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No employee ID found in session/i)).toBeDefined();
    });
  });

  it('shows error message if query fails', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_EMPLOYEE_BY_ID,
          variables: { getEmployeebyIdId: mockEmployeeId },
        },
        error: new Error('GraphQL error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter>
          <Viewmydetails />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch employee details/i)).toBeDefined();
    });
  });

  it('navigates to update page on button click', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/employee/view-my-details']}>
          <Viewmydetails />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {screen.getByText(/Edit My Details/i)});

    fireEvent.click(screen.getByText(/Edit My Details/i));
    // You would normally assert navigation via mocked `useNavigate`, or check updated route in `MemoryRouter`.
  });
});
