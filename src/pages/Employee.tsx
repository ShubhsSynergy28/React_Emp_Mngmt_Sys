import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const Employee = () => {
  return (
    // <div>Employee</div>
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>

  )
}

export default Employee