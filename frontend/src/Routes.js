import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import FlightSearch from './Components/FlightSearch';
import StatusSearch from './Components/StatusSearch';
import RegisterForm from './Components/RegisterForm';
import CustomerHomePage from './Components/CustomerHomePage';
import AirlineStaffHomePage from './Components/AirlineStaffHomePage';



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
