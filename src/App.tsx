import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import PageNotFound from './pages/PageNotFound'
import AuthRoutes from './routes/AuthRoutes'
import EmployeeRoutes from './routes/EmployeeRoutes'
import AdminRoutes from './routes/AdminRoutes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout Route */}
        <Route path="/" element={<Layout />}>
          {/* Employee Routes */}
          <Route path="employee/*" element={<EmployeeRoutes />} />
          {/* Admin Routes */}
          <Route path="admin/*" element={<AdminRoutes />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="auth/*" element={<AuthRoutes />} />

        {/* Catch-All Route for 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
