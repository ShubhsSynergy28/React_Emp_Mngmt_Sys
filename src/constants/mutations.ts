import { gql } from '@apollo/client';

export const ADD_EMPLOYEE_MUTATION = gql`
  mutation Mutation($input: AddEmployeeInput!) {
    addEmployee(input: $input) {
      message
    }
  }
`;

export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployee($deleteEmployeeId: String) {
    deleteEmployee(id: $deleteEmployeeId) {
      message
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($input: UpdateEmployeeInput!, $updateEmployeeId: String!) {
    updateEmployee(input: $input, id: $updateEmployeeId) {
      message
    }
  }
`;

export const LOGIN_EMPLOYEE= gql`
mutation Mutation($employeeLoginData: LoginEmployeeInput!) {
  employeeLogin(Employee_login_data: $employeeLoginData) {
    access_token
    refresh_token
    employee {
      id
      name
    }
    message
  }
}
`;

export const LOGIN_USER = gql `
mutation UserLogin($uSerLoginData: UserLoginInput!) {
  userLogin(USer_login_data: $uSerLoginData) {
    refresh_token
    message
    access_token
    user {
      username
    }
  }
}
`

export const EMPLOYEE_LOGOUT = gql`
  mutation EmployeeLogout {
    EmployeeLogout {
      message
    }
  }
`;

export const USER_LOGOUT = gql`
  mutation UserLogout {
    userLogout {
      message
    }
  }
`;
