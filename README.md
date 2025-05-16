# Vite + TypeScript + Apollo GraphQL Project Setup

This guide will help you set up a new Vite project with TypeScript and Apollo GraphQL support.

## Prerequisites

- Node.js 18+ installed
- npm/yarn/pnpm (recommended)
- GraphQL server endpoint

## 1. Create a new Vite project

```bash
# npm
npm create vite@latest my-vite-app -- --template react-ts

# yarn
yarn create vite my-vite-app --template react-ts

# pnpm
pnpm create vite my-vite-app --template react-ts
2. Install Apollo Client
bash
# npm
npm install @apollo/client graphql

# yarn
yarn add @apollo/client graphql

# pnpm
pnpm add @apollo/client graphql
3. Set up Apollo Client
In your main.tsx (or main.jsx):

typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './index.css'
import App from './App'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
4. Using GraphQL Queries and Mutations
Defining Queries and Mutations
Create a file (e.g., src/graphql/operations.ts) to store your operations:

typescript
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

export const ADD_EMPLOYEE_MUTATION = gql`
  mutation Mutation($input: AddEmployeeInput!) {
    addEmployee(input: $input) {
      message
    }
  }
`;

export const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployee($deleteEmployeeId: String!) {
    deleteEmployee(id: $deleteEmployeeId) {
      message
    }
  }
`;
Using in Components
typescript
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_EMPLOYEE_BY_ID, 
  ADD_EMPLOYEE_MUTATION,
  DELETE_EMPLOYEE_MUTATION 
} from '../graphql/operations';

function EmployeeComponent() {
  // Query example
  const { loading, error, data } = useQuery(GET_EMPLOYEE_BY_ID, {
    variables: { getEmployeebyIdId: '123' },
    pollInterval: 1000, // Refreshes data every 1 second
  });

  // Mutation example
  const [addEmployee] = useMutation(ADD_EMPLOYEE_MUTATION);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE_MUTATION);

  const handleAddEmployee = async () => {
    try {
      const { data } = await addEmployee({
        variables: {
          input: {
            // Your input fields here
          }
        }
      });
      
      // Handle success
      console.log(data.addEmployee.message);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Render your data */}
      {data?.getEmployeebyId && (
        <div>
          <h2>{data.getEmployeebyId.EName}</h2>
          {/* Other fields */}
        </div>
      )}
      
      <button onClick={handleAddEmployee}>Add Employee</button>
    </div>
  );
}
5. Handling Loading and Error States
Apollo Client provides loading, error, and data states that you can use to manage your UI:

typescript
const { loading, error, data } = useQuery(GET_EMPLOYEE_BY_ID);

if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorDisplay message={error.message} />;
}

// When successful, render the data
return <EmployeeData data={data.getEmployeebyId} />;
6. Advanced Configuration
Customizing Apollo Client
You can extend the Apollo Client configuration:

typescript
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      // Custom cache policies
    }
  }),
  headers: {
    authorization: localStorage.getItem('token') || '',
  },
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
Error Handling
For global error handling:

typescript
import { ApolloClient, InMemoryCache, ApolloProvider, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createHttpLink } from '@apollo/client/link/http';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
7. Testing Queries in Apollo Studio
Open your GraphQL server in Apollo Studio

Copy queries/mutations from the "Docs" section

Paste them into your operations file

Test them in the "Explorer" before using in your app

8. Additional Resources
Apollo Client Official Documentation

GraphQL Syntax

Vite + React + TypeScript Guide

9. Example Component Structure
src/
├── components/
│   ├── Employee/
│   │   ├── EmployeeList.tsx
│   │   ├── EmployeeForm.tsx
│   │   └── EmployeeItem.tsx
├── graphql/
│   ├── operations.ts
│   └── client.ts
├── hooks/
│   └── useEmployees.ts
├── App.tsx
└── main.tsx
10. TypeScript Support
For better TypeScript support, generate types from your GraphQL schema:

bash
npm install -D @graphql-codegen/cli
npx graphql-codegen init
Follow the prompts to set up code generation. This will create type definitions for your queries and mutations.


This updated README provides a comprehensive guide for setting up Apollo GraphQL with Vite and TypeScript, including query/mutation examples, error handling, and TypeScript integration