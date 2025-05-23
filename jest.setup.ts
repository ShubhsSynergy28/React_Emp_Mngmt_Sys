// setupTests.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock import.meta.env
// beforeAll(() => {
//   Object.defineProperty(globalThis, 'import', {
//     value: {
//       meta: {
//         env: {
//           VITE_GET_ALL_AVAILABLE_HOBBIES: "http://127.0.0.1:5000/get-all-available-hobbies",
//           VITE_GET_ALL_AVAILABLE_EDUCATION: "http://127.0.0.1:5000/get-all-available-educations",
//           VITE_POST_CREATE_EMPLOYEE: "http://127.0.0.1:5000/createEmployee",
//           VITE_GET_ALL_EMPLOYEES: "http://127.0.0.1:5000/employees",
//           VITE_DELETE_EMPLOYEE: "http://127.0.0.1:5000/delete-employee",
//           VITE_GET_EMPLOYEE_BY_ID: "http://127.0.0.1:5000/employee",
//           VITE_UPDATE_EMPLOYEE: "http://127.0.0.1:5000/update-employee",
//           VITE_LOGOUT_ADMIN: "http://localhost:5000/logout",
//           VITE_LOGOUT_EMPLOYEE: "http://localhost:5000/logout-emp",
//         }
//       }
//     },
//     configurable: true
//   });
// });