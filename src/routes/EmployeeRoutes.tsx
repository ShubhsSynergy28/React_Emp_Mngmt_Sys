import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Employee from '../pages/Employee'
import Viewmydetails from '../components/employee/Viewmydetails'
import Updatemydetails from '../components/employee/Updatemydetails'

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Employee />}>
        <Route index element={<Viewmydetails />} />
        <Route path="update-my-details" element={<Updatemydetails />} />
      </Route>
    </Routes>
  )
}

export default EmployeeRoutes