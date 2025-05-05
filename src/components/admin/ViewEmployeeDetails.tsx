import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import '../../assets/styles/admin/ViewEmployeeDetails.scss'

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

const ViewEmployeeDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No employee ID provided.');
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await axios.get<Employee>(`${import.meta.env.VITE_GET_EMPLOYEE_BY_ID}/${id}`);
        setEmployee(res.data);
      } catch (err) {
        setError('Failed to fetch employee details.' + err);
      }
    };

    fetchEmployee();
  }, [id]);

  if (error) {
    return <div className="view-error">{error}</div>;
  }

  if (!employee) {
    return <div className="view-loading">Loading...</div>;
  }

  return (
    <div className="view-employee-details">
      <h2>{employee.name}</h2>
      <p><strong>Phone:</strong> {employee.phone_no}</p>
      <p><strong>Birth Date:</strong> {employee.birth_date}</p>
      <p><strong>Gender:</strong> {employee.gender}</p>
      <p><strong>Description:</strong> {employee.description}</p>
      <p><strong>Education:</strong> {employee.education.join(', ') || 'N/A'}</p>
      <p><strong>Hobbies:</strong> {employee.hobbies.join(', ') || 'N/A'}</p>
    </div>
  );
};

export default ViewEmployeeDetails;
