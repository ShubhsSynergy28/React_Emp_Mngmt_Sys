import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Admin from '../pages/Admin'
import Dashboard from '../components/admin/Dashboard'
import Createemployee from '../components/admin/Createemployee'
import Updateemployeedetails from '../components/admin/Updateemployeedetails'
import ViewEmployeeDetails from '../components/admin/ViewEmployeeDetails'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        <Route index element={<Dashboard />} />
        <Route path="create-employee" element={<Createemployee />} />
        <Route path="update-employee" element={<Updateemployeedetails />} />
        <Route path="view-employee" element={<ViewEmployeeDetails />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes