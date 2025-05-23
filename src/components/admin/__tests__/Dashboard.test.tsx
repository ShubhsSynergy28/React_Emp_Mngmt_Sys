import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock icons
jest.mock('react-icons/fi', () => ({
  FiEye: () => <span>EyeIcon</span>,
  FiEdit2: () => <span>EditIcon</span>,
  FiTrash2: () => <span>TrashIcon</span>,
  FiPlus: () => <span>PlusIcon</span>,
  FiChevronLeft: () => <span>ChevronLeftIcon</span>,
  FiChevronRight: () => <span>ChevronRightIcon</span>,
  FiX: () => <span>CloseIcon</span>,
  FiCheck: () => <span>CheckIcon</span>,
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('Dashboard Component', () => {
  const mockNavigate = jest.fn();
  const mockDeleteEmployee = jest.fn();
  const mockEmployees = [
    {
      id: 1,
      name: 'John Doe',
      phone_no: '1234567890',
      birth_date: '1990-01-01',
      gender: 'Male',
      description: 'Test description',
      education: ['Bachelor'],
      hobbies: ['Reading'],
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone_no: '0987654321',
      birth_date: '1995-05-15',
      gender: 'Female',
      description: 'Another description',
      education: ['Master'],
      hobbies: ['Swimming'],
    },
  ];

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useMutation as jest.Mock).mockReturnValue([mockDeleteEmployee]);
    mockSessionStorage.getItem.mockReturnValue('Test Admin');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
    });

    render(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('should render error state', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: { message: 'Failed to fetch' },
      data: undefined,
    });

    render(<Dashboard />);
    expect(screen.getByText(/Failed to fetch employees/i)).toBeDefined();
  });

  it('should render employee data', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        getAllEmployees: mockEmployees.map(emp => ({
          Eid: emp.id,
          EName: emp.name,
          Ephone: emp.phone_no,
          Ebirth_date: emp.birth_date,
          Egender: emp.gender,
          Edescription: emp.description,
          educations: emp.education,
          hobbies: emp.hobbies,
        })),
      },
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeDefined();
      expect(screen.getByText('Jane Smith')).toBeDefined();
      expect(screen.getByText('2 employees')).toBeDefined();
    });
  });

  it('should handle search functionality', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        getAllEmployees: mockEmployees.map(emp => ({
          Eid: emp.id,
          EName: emp.name,
          Ephone: emp.phone_no,
          Ebirth_date: emp.birth_date,
          Egender: emp.gender,
          Edescription: emp.description,
          educations: emp.education,
          hobbies: emp.hobbies,
        })),
      },
    });

    await act(async () => {
      render(<Dashboard />);
    });

    const searchInput = screen.getByPlaceholderText('Search employees...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeDefined();
      expect(screen.queryByText('Jane Smith')).toBeNull();
      expect(screen.getByText('1 employees')).toBeDefined();
    });
  });

  

  it('should show delete confirmation dialog', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        getAllEmployees: mockEmployees.map(emp => ({
          Eid: emp.id,
          EName: emp.name,
          Ephone: emp.phone_no,
          Ebirth_date: emp.birth_date,
          Egender: emp.gender,
          Edescription: emp.description,
          educations: emp.education,
          hobbies: emp.hobbies,
        })),
      },
    });

    await act(async () => {
      render(<Dashboard />);
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete "John Doe"/i)).toBeDefined();
    });
  });

  it('should handle employee deletion', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        getAllEmployees: mockEmployees.map(emp => ({
          Eid: emp.id,
          EName: emp.name,
          Ephone: emp.phone_no,
          Ebirth_date: emp.birth_date,
          Egender: emp.gender,
          Edescription: emp.description,
          educations: emp.education,
          hobbies: emp.hobbies,
        })),
      },
    });

    mockDeleteEmployee.mockResolvedValue(true);

    await act(async () => {
      render(<Dashboard />);
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteEmployee).toHaveBeenCalledWith({
        variables: { deleteEmployeeId: '1' },
        update: expect.any(Function),
      });
      expect(screen.queryByText(/Are you sure you want to delete/i)).toBeNull();
    });
  });

  it('should navigate to view, edit, and add employee pages', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        getAllEmployees: mockEmployees.map(emp => ({
          Eid: emp.id,
          EName: emp.name,
          Ephone: emp.phone_no,
          Ebirth_date: emp.birth_date,
          Egender: emp.gender,
          Edescription: emp.description,
          educations: emp.education,
          hobbies: emp.hobbies,
        })),
      },
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Test view button
    const viewButtons = screen.getAllByTitle('View');
    fireEvent.click(viewButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/view-employee?id=1');

    // Test edit button
    const editButtons = screen.getAllByTitle('Edit');
    fireEvent.click(editButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/update-employee?id=1');

    // Test add employee button
    const addButton = screen.getByText('Add Employee');
    fireEvent.click(addButton);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/create-employee');
  });

  it('should display snackbar messages', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        getAllEmployees: mockEmployees.map(emp => ({
          Eid: emp.id,
          EName: emp.name,
          Ephone: emp.phone_no,
          Ebirth_date: emp.birth_date,
          Egender: emp.gender,
          Edescription: emp.description,
          educations: emp.education,
          hobbies: emp.hobbies,
        })),
      },
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Snackbar should show on successful load
    await waitFor(() => {
      expect(screen.getByText('Employees loaded successfully')).toBeDefined();
    });

    // Close snackbar
    const closeButton = screen.getByText('CloseIcon');
    fireEvent.click(closeButton);
    expect(screen.queryByText('Employees loaded successfully')).toBeNull();
  });
});