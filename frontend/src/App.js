
import { BrowserRouter as Router} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import RoutesConfig from './Routes'; 
import './App.css';


const App = () =>{

  


  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');

  
  const handleLogin = async () => {
    setLoggedIn(true);

    const response = await fetch('/getUserType', {
      method: 'GET',
    });

    if (response.status === 200){
      console.log("ASDASD");
      const responseData = await response.json();
      setUserType(responseData['userType']);
    }
  };

  const handleLogout = () => {

    setLoggedIn(false);
    fetch('/logout', {
      method: 'POST',
    });

  };




  return (
    <div>
      <Router>
      
        <Navbar isLoggedIn={isLoggedIn ? true : false} onLogout={handleLogout} userType={userType}/>

        <RoutesConfig isLoggedIn = {isLoggedIn ? true : false} handleLogin= {handleLogin} />
      </Router>
    </div>
  );
}
export default App;