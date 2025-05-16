import { gql } from '@apollo/client';

export const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeebyId($getEmployeebyIdId: String) {
    getEmployeebyId(id: $getEmployeebyIdId) {
      Eid
      EName
      Ephone
      Ebirth_date
      Egender
      Edescription
      Efile_path
      hobbies
      educations
    }
  }
`;

export const GET_ALL_EMPLOYEES_QUERY = gql`
  query GetAllEmployees {
    getAllEmployees {
      Eid
      EName
      Ephone
      Ebirth_date
      Egender
      Edescription
      Efile_path
      hobbies
      educations
    }
  }
`;