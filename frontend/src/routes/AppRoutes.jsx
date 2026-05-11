import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChooseRegister from "../pages/auth/ChooseRegister";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import Home from "../pages/general/Home";
import Profile from "../pages/food-partner/Profile";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Home />} />
        <Route path='/create-food' element={<div>Create Food</div>}/>

        {/* Role selection */}``
        <Route path="/register" element={<ChooseRegister />} />

        {/* User routes */}
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />

        {/* Food Partner routes */}
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/food-partner/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
