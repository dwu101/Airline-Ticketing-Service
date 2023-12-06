import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const Navbar = ({ isLoggedIn, onLogout, userType }) => {

  console.log("NAV");
    console.log(isLoggedIn);
    console.log(userType);
    
    return (
      <div className='Navbar'>
      <div>
          {isLoggedIn ? (
              <div>
                <Link to ="/Login">
                  <button onClick = {onLogout}> Logout </button>
                </Link>

                {userType==="Customer"? (
                  <div>
                      <Link to ="/CustomerHomePage">
                        <button > Home </button>
                      </Link>

                  </div>
                ):(
                  <div>
                    <Link to ="/StaffHomePage">
                        <button > Home </button>
                    </Link>

                  </div>
                )}
                
              </div>
            ) : (
            <div>
              <Link to="/Login">LOGIN / REGISTER HERE</Link>
            </div>
            )}
        </div>

        <div>
          <Link to="/FlightSearch" > SEARCH FLIGHTS</Link>
        </div>

        <div>
          <Link to="/StatusSearch"> SEARCH FLIGHT STATUS</Link>
        </div>

      
        
      </div>
    );
    
  };


Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Navbar