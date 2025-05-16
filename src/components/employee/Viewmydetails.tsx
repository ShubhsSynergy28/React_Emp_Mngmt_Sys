import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/employee/Viewmydetails.scss';
import { GET_EMPLOYEE_BY_ID } from '../../constants/query';
import { useQuery } from '@apollo/client';

// interface Employee {
//   id: number;
//   name: string;
//   phone_no: string;
//   birth_date: string;
//   gender: string;
//   description: string;
//   file_path: string;
//   education: string[];
//   hobbies: string[];
// }

const Viewmydetails: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem('employee_id');

  const { loading, data, error: queryError } = useQuery(GET_EMPLOYEE_BY_ID, {
    variables: {
      getEmployeebyIdId: employeeId
    },
    skip: !employeeId, // Skip the query if no employee ID
    pollInterval: 1000,
  });

  useEffect(() => {
    if (!employeeId) {
      setError('No employee ID found in session.');
    }
  }, [employeeId]);

  useEffect(() => {
    if (queryError) {
      setError('Failed to fetch employee details. ' + queryError.message);
    }
  }, [queryError]);

  if (error) return <div className="employee-details-error">{error}</div>;
  if (loading) return <div className="employee-details-loading">Loading...</div>;
  if (!data?.getEmployeebyId) return <div className="employee-details-error">No employee data found</div>;

  const employee = data.getEmployeebyId;

  return (
    <div className="employee-details-container">
      <h2>My Profile</h2>

      <div className="detail"><strong>Name:</strong> {employee.EName}</div>
      <div className="detail"><strong>Phone:</strong> {employee.Ephone}</div>
      <div className="detail"><strong>Date of Birth:</strong> {employee.Ebirth_date}</div>
      <div className="detail"><strong>Gender:</strong> {employee.Egender}</div>
      <div className="detail"><strong>Description:</strong> {employee.Edescription}</div>
      <div className="detail"><strong>Education:</strong> {employee.educations.join(', ')}</div>
      <div className="detail"><strong>Hobbies:</strong> {employee.hobbies.join(', ')}</div>

      <button className="edit-button" onClick={() => navigate('/employee/update-my-details')}>
        Edit My Details
      </button>
    </div>
  );
};

export default Viewmydetails;