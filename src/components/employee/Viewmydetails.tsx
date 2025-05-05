import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/employee/Viewmydetails.scss';

interface Employee {
  id: number;
  name: string;
  phone_no: string;
  birth_date: string;
  gender: string;
  description: string;
  file_path: string;
  education: string[];
  hobbies: string[];
}

const Viewmydetails: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      const id = sessionStorage.getItem('employee_id');
      if (!id) {
        setError('No employee ID found in session.');
        return;
      }

      try {
        const response = await axios.get<Employee>(`${import.meta.env.VITE_GET_EMPLOYEE_BY_ID}/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError('Failed to fetch employee details. ' + err);
      }
    };

    fetchEmployee();
  }, []);

  if (error) return <div className="employee-details-error">{error}</div>;
  if (!employee) return <div className="employee-details-loading">Loading...</div>;

  return (
    <div className="employee-details-container">
      <h2>My Profile</h2>

      <div className="detail"><strong>Name:</strong> {employee.name}</div>
      <div className="detail"><strong>Phone:</strong> {employee.phone_no}</div>
      <div className="detail"><strong>Date of Birth:</strong> {employee.birth_date}</div>
      <div className="detail"><strong>Gender:</strong> {employee.gender}</div>
      <div className="detail"><strong>Description:</strong> {employee.description}</div>
      <div className="detail"><strong>Education:</strong> {employee.education.join(', ')}</div>
      <div className="detail"><strong>Hobbies:</strong> {employee.hobbies.join(', ')}</div>

      <button className="edit-button" onClick={() => navigate('/employee/update-my-details')}>
        Edit My Details
      </button>
    </div>
  );
};

export default Viewmydetails;
