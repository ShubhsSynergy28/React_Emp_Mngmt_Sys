import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ViewEmployeeDetails from '../ViewEmployeeDetails';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
}));

describe('ViewEmployeeDetails', () => {
  const mockEmployee = {
    Eid: 123,
    EName: 'John Doe',
    Ephone: '1234567890',
    Ebirth_date: '1990-01-01',
    Egender: 'Male',
    Edescription: 'Test description',
    educations: ['Bachelor', 'Master'],
    hobbies: ['Reading', 'Swimming'],
  };

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams('id=123')]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
    });

    render(<ViewEmployeeDetails />);
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('should display employee details when data is loaded', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: { getEmployeebyId: mockEmployee },
    });

    render(<ViewEmployeeDetails />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeDefined();
      expect(screen.getByText('1234567890')).toBeDefined();
      expect(screen.getByText('1990-01-01')).toBeDefined();
      expect(screen.getByText('Male')).toBeDefined();
      expect(screen.getByText('Test description')).toBeDefined();
      expect(screen.getByText('Bachelor, Master')).toBeDefined();
      expect(screen.getByText('Reading, Swimming')).toBeDefined();
    });
  });

  it('should show error message when there is an error', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: { message: 'Failed to fetch employee details' },
      data: undefined,
    });

    render(<ViewEmployeeDetails />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch employee details/i)).toBeDefined();
    });
  });

  it('should show error when no ID is provided', async () => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams('')]);
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: undefined,
    });

    render(<ViewEmployeeDetails />);

    await waitFor(() => {
      expect(screen.getByText('No employee ID provided.')).toBeDefined();
    });
  });

 
});