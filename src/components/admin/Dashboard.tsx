import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { DELETE_EMPLOYEE_MUTATION } from '../../constants/mutations';
import { GET_ALL_EMPLOYEES_QUERY } from '../../constants/query';
import { 
  FiEye, 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiChevronLeft, 
  FiChevronRight,
  FiX,
  FiCheck
} from 'react-icons/fi';
import '../../assets/styles/admin/Dashboard.scss';

interface Employee {
  id: number;
  name: string;
  phone_no: string;
  birth_date: string;
  gender: string;
  description: string;
  education: string[];
  hobbies: string[];
}

interface SnackbarProps {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
}


const Snackbar: React.FC<SnackbarProps> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => {return clearTimeout(timer)};
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = {
    success: '#4caf50',
    error: '#f44336',
    info: '#2196f3'
  }[type];

  return (
    <div className="snackbar" style={{ backgroundColor: bgColor }}>
      <div className="snackbar-content">
        <span>{message}</span>
        <button onClick={onClose} className="snackbar-close">
          <FiX />
        </button>
      </div>
    </div>
  );
};

const ConfirmationDialog: React.FC<{
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <div className="dialog-content">
          <p>{message}</p>
        </div>
        <div className="dialog-actions">
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-btn">
            <FiCheck /> Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { loading: loadingEmps, error: errorInFetchEmp, data: allEmpData } = useQuery(
    GET_ALL_EMPLOYEES_QUERY,
    {pollInterval: 1000,}
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteEmployeeMutation] = useMutation(DELETE_EMPLOYEE_MUTATION);
  const [snackbar, setSnackbar] = useState<Omit<SnackbarProps, 'onClose'>>({ 
    message: '', 
    type: 'info', 
    show: false 
  });
  const [deleteDialog, setDeleteDialog] = useState({
    show: false,
    employeeId: 0,
    employeeName: ''
  });
  const navigate = useNavigate();

  const adminName = sessionStorage.getItem('name') || 'Admin';

  useEffect(() => {
    if (allEmpData?.getAllEmployees) {
      const transformedEmployees = allEmpData.getAllEmployees.map((emp: any) => {return {
        id: emp.Eid,
        name: emp.EName,
        phone_no: emp.Ephone,
        birth_date: emp.Ebirth_date,
        gender: emp.Egender,
        description: emp.Edescription,
        education: emp.educations || [],
        hobbies: emp.hobbies || []
      }});
      
      setEmployees(transformedEmployees);
      showSnackbar('Employees loaded successfully', 'success');
      setLoading(false);
    }
  }, [allEmpData]);

  useEffect(() => {
    if (errorInFetchEmp) {
      setError('Failed to fetch employees: ' + errorInFetchEmp.message);
      showSnackbar('Failed to load employees', 'error');
      setLoading(false);
    }
  }, [errorInFetchEmp]);

  useEffect(() => {
    setLoading(loadingEmps);
  }, [loadingEmps]);

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info') => {
    setSnackbar({ message, type, show: true });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => {return { ...prev, show: false }});
  };

  const showDeleteDialog = (id: number, name: string) => {
    setDeleteDialog({
      show: true,
      employeeId: id,
      employeeName: name
    });
  };

  const hideDeleteDialog = () => {
    setDeleteDialog({
      show: false,
      employeeId: 0,
      employeeName: ''
    });
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp =>
    {return emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone_no.includes(searchTerm) ||
    emp.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.education.some(edu => {return edu.toLowerCase().includes(searchTerm.toLowerCase())}) ||
    emp.hobbies.some(hobby => {return hobby.toLowerCase().includes(searchTerm.toLowerCase())})}
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => {return setCurrentPage(pageNumber)};

  // Handle page size change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
  try {
    await deleteEmployeeMutation({
      variables: { deleteEmployeeId: id.toString() },  // convert to string if needed
      update: (cache) => {
        cache.modify({
          fields: {
            getAllEmployees(existingEmployeesRefs = [], { readField }) {
              return existingEmployeesRefs.filter(
                (empRef: any) => {return id.toString() !== readField('Eid', empRef)}
              );
            }
          }
        });
      }
    });

    setEmployees(prev => {return prev.filter(emp => {return emp.id !== id})});
    showSnackbar('Employee deleted successfully', 'success');
  } catch (err: any) {
    showSnackbar(`Failed to delete employee: ${err.message}`, 'error');
  } finally {
    hideDeleteDialog();
  }
};


  const handleEdit = (id: number) => {
    navigate(`/admin/update-employee?id=${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/admin/view-employee?id=${id}`);
  };

  const handleAddEmployee = () => {
    navigate('/admin/create-employee');
  };

  // Generate page numbers for slider
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return (
    <div className="admin-dashboard">
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        show={snackbar.show}
        onClose={hideSnackbar}
      />
      
      <ConfirmationDialog
        show={deleteDialog.show}
        message={`Are you sure you want to delete "${deleteDialog.employeeName}"? This action cannot be undone.`}
        onConfirm={() => {return handleDelete(deleteDialog.employeeId)}}
        onCancel={hideDeleteDialog}
      />

      <div className="dashboard-header">
        <div>
          <h2>Welcome, {adminName}</h2>
          <p className="dashboard-subtitle">Employee Management</p>
        </div>
        <button className="add-employee-btn" onClick={handleAddEmployee}>
          <FiPlus className="icon" />
          Add Employee
        </button>
      </div>

      <div className="dashboard-content">
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="table-header">
            <h3>Employee List</h3>
            {filteredEmployees.length > 0 && (
              <span className="employee-count">{filteredEmployees.length} employees</span>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone No</th>
                  <th>Birth Date</th>
                  <th>Gender</th>
                  <th>Description</th>
                  <th>Education</th>
                  <th>Hobbies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-data">
                      {searchTerm ? 'No matching employees found.' : 'No employees found. Click "Add Employee" to create one.'}
                    </td>
                  </tr>
                ) : (
                  currentItems.map(emp => {return (
                    <tr key={emp.id}>
                      <td data-label="Name">{emp.name}</td>
                      <td data-label="Phone No">{emp.phone_no}</td>
                      <td data-label="Birth Date">{emp.birth_date}</td>
                      <td data-label="Gender">{emp.gender}</td>
                      <td data-label="Description" className="description-cell">
                        {emp.description.length > 50
                          ? `${emp.description.substring(0, 50)}...`
                          : emp.description}
                      </td>
                      <td data-label="Education">{emp.education.join(', ')}</td>
                      <td data-label="Hobbies">{emp.hobbies.join(', ')}</td>
                      <td data-label="Actions" className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="view-btn"
                            onClick={() => {return handleView(emp.id)}}
                            title="View"
                          >
                            <FiEye className="icon" />
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => {return handleEdit(emp.id)}}
                            title="Edit"
                          >
                            <FiEdit2 className="icon" />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => {return showDeleteDialog(emp.id, emp.name)}}
                            title="Delete"
                          >
                            <FiTrash2 className="icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>

            {filteredEmployees.length > 0 && (
              <div className="pagination-controls">
                <div className="items-per-page">
                  <span>Employees per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    {[5, 10, 15, 20, 25, 30].map(size => {return (
                      <option key={size} value={size}>{size}</option>
                    )})}
                  </select>
                </div>

                <div className="page-slider">
                  <button
                    onClick={() => {return paginate(Math.max(1, currentPage - 1))}}
                    disabled={currentPage === 1}
                    className="page-nav"
                  >
                    <FiChevronLeft />
                  </button>

                  {startPage > 1 && (
                    <>
                      <button onClick={() => {return paginate(1)}} className="page-number">1</button>
                      {startPage > 2 && <span className="ellipsis">...</span>}
                    </>
                  )}

                  {Array.from({ length: endPage - startPage + 1 }, (_, i) => {return (
                    <button
                      key={startPage + i}
                      onClick={() => {return paginate(startPage + i)}}
                      className={`page-number ${currentPage === startPage + i ? 'active' : ''}`}
                    >
                      {startPage + i}
                    </button>
                  )})}

                  {endPage < totalPages && (
                    <>
                      {endPage < totalPages - 1 && <span className="ellipsis">...</span>}
                      <button onClick={() => {return paginate(totalPages)}} className="page-number">
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {return paginate(Math.min(totalPages, currentPage + 1))}}
                    disabled={currentPage === totalPages}
                    className="page-nav"
                  >
                    <FiChevronRight />
                  </button>
                </div>

                <div className="page-info">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} employees
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;