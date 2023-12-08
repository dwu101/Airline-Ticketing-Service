import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';

const LoginForm = ({onLogin}) => {
  // State to manage user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();

  

  const handleSubmit = async(e) => {
    e.preventDefault();
    
   
    console.log('Username:', username);
    console.log('Password:', password);
    console.log("loginStatus", loginStatus);
  try{
    const response = await fetch('/LoginAuth', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            'Username': username,
            'Password': password,
            'LoginType': loginType
        })
      });
      console.log(response)
      if (response.status === 201){
        setLoginStatus("Logged in");
        onLogin();
        
        if (loginType === "Customer"){
          navigate('/CustomerHomePage');
        }
        else{
          navigate('/AirlineStaffHomePage');
        }
      }
      else if (response.status === 400){
        setLoginStatus("Error: Username or Password incorrect")
      }
      else if (response.status === 405){
        setLoginStatus("Please enter values.")
      }

      
    }
    catch (error){
      console.log("ASUIFNOEG");
    }

  };

  return (
    <div>
    <form onSubmit={handleSubmit} className='flightSearchBox'>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          className='inputBox'
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          className='inputBox'
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className='inputBox'>
        <label>I am:</label>
        <select onChange={(e) => setLoginType(e.target.value)} required>
          <option value="">Select...</option>
          <option value="Customer">A Customer</option>
          <option value="Airline Staff">Airline Staff</option>
        </select>
      </div>


      <button type="submit">Login</button>


    </form>
    <div>
      <p>{loginStatus}</p>
    </div>

    <button type="submit">
    <div>
          <Link to="/RegisterForm"> Don't Have an Account? Register Here</Link>
    </div>
    </button>

    </div>
  );
};

export default LoginForm;
