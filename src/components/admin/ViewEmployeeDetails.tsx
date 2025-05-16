import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import '../../assets/styles/admin/ViewEmployeeDetails.scss';
import { GET_EMPLOYEE_BY_ID } from '../../constants/query';

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

  const { loading, error: queryError, data } = useQuery(GET_EMPLOYEE_BY_ID, {
    variables: { getEmployeebyIdId: id },
    skip: !id,
    pollInterval: 1000
  });

  useEffect(() => {
    if (!id) {
      setError('No employee ID provided.');
      return;
    }

    if (queryError) {
      setError(`Failed to fetch employee details: ${queryError.message}`);
      return;
    }

    if (data?.getEmployeebyId) {
      const empData = data.getEmployeebyId;
      setEmployee({
        id: empData.Eid,
        name: empData.EName,
        phone_no: empData.Ephone,
        birth_date: empData.Ebirth_date,
        gender: empData.Egender,
        description: empData.Edescription,
        education: empData.educations || [],
        hobbies: empData.hobbies || []
      });
    }
  }, [id, data, queryError]);

  if (error) {
    return <div className="view-error">{error}</div>;
  }

  if (loading || !employee) {
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