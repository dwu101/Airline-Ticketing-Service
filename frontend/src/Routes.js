import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './Pages/LoginForm';
import FlightSearch from './Pages/FlightSearch';
import StatusSearch from './Pages/StatusSearch';
import RegisterForm from './Pages/RegisterForm';
import CustomerHomePage from './Pages/CustomerHomePage';
import AirlineStaffHomePage from './Pages/AirlineStaffHomePage';



const RoutesConfig = ({isLoggedIn, handleLogin}) => {
 
  return (

    <Routes>
      <Route path="/Login" element={!isLoggedIn ? <LoginForm onLogin={handleLogin} /> : <p>User is logged in!</p>} />
      <Route path="/FlightSearch" element={<FlightSearch isloggedin = {isLoggedIn} />} />
      <Route path="/StatusSearch" element={<StatusSearch />} />
      <Route path="/RegisterForm" element={<RegisterForm />} />
      <Route path="/CustomerHomePage" element={<CustomerHomePage />} />
      <Route path="/AirlineStaffHomePage" element={<AirlineStaffHomePage />} />


    </Routes>
  );
};

export default RoutesConfig;
