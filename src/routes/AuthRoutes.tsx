import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../pages/Auth";
import Login from "../components/auth/login";
import Register from "../components/auth/register";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
