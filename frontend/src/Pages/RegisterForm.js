import React, { useState } from 'react';
import TextInputBox from '../Components/TextInputBox';
import DateInputBox from '../Components/DateInputBox';

const RegisterForm = () => {
  // State to manage user input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerType, setRegisterType] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');
  const [DOB, setDOB] = useState('');
  const [password, setPassword] = useState('');

  const [username, setUsername] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const [buildingNumber, setBuildingNumber] = useState(0);
  const [streetName, setStreetName] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState(0);
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiration, setPassportExpiration] = useState('');
  const [passportCountry, setPassportCountry] = useState('');
  const [phoneNumCust, setPhoneNumCust] = useState('');

  const [phoneNumAS, setPhoneNumAS] = useState('');
  const [airlineStaffEmail, setAirlineStaffEmail] = useState('');

  

  const handleSubmit = async(e) => {
    
    e.preventDefault();

    if (registerType === "Customer"){

    const response = await fetch('/CustomerRegister', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },

        body: JSON.stringify({
            "emailAddress" : emailAddress,
            "firstName": firstName,
            "lastName": lastName,
            "password": password,
            "DOB": DOB,
            "buildingNumber":buildingNumber ,
            "streetName": streetName,
            "apartmentNumber":apartmentNumber ,
            "city":city ,
            "state": stateName,
            "zipCode":zipCode ,
            "passportNumber":passportNumber ,
            "passportExpiration":passportExpiration ,
            "passportCountry":passportCountry ,
            'phoneNum': phoneNumCust
        })
      });

      if (response.status === 200){
        setRegisterStatus("Registered!");
      }
      else {// (response.status === 400){
        setRegisterStatus("Error: User already exists")
      }
      
  }

  else{
    const response = await fetch('/AirlineStaffRegister', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            "username" : username,
            "firstName": firstName,
            "lastName": lastName,
            "password": password,
            "DOB": DOB,
            "airlineName" : airlineName,
            "emailAddress" : airlineStaffEmail,
            'phoneNum': phoneNumAS
        })
      });

      if (response.status === 200){
        setRegisterStatus("Registered!");
      }
      else {// (response.status === 400){
        setRegisterStatus("Error: User already exists")
      }
  }
}

  return (
    <div>
        
    <form onSubmit={handleSubmit} className='flightSearchBox'>


    <TextInputBox setState={setFirstName} label={"First name:"} />
    <TextInputBox setState={setLastName} label={"Last name:"} />
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
        <select onChange={(e) => setRegisterType(e.target.value)} required>
          <option value="">Select...</option>
          <option value="Customer">A Customer</option>
          <option value="Airline Staff">Airline Staff</option>
        </select>
      </div>
     

        <DateInputBox setState={setDOB} label= {"DOB"} />
  

        {registerType === "Customer" && (
            <div>
                <TextInputBox setState={setEmailAddress} label={"Email Address:"} />
                <TextInputBox setState={setBuildingNumber} label={"Building Number:"} />
                <TextInputBox setState={setStreetName} label={"Street name:"} />
                <TextInputBox setState={setApartmentNumber} label={"Apartment Number:"} />
                <TextInputBox setState={setCity} label={"City:"} />
                <TextInputBox setState={setStateName} label={"State:"} />
                <TextInputBox setState={setZipCode} label={"Zip Code:"} />
                <TextInputBox setState={setPassportNumber} label={"Passport Number:"} />
                <DateInputBox setState={setPassportExpiration} label={"Passport Expiration Date:"} />
                <TextInputBox setState={setPassportCountry} label={"Passport Country:"} />
                <TextInputBox setState={setPhoneNumCust} label={"Phone Number: (you can add more phone numbers after you register)"}  />

            </div>
        )}

        {registerType === "Airline Staff" && (
            <div>
                <TextInputBox setState={setUsername} label={"Username:"} />
                <TextInputBox setState={setAirlineName} label={"Airline Name:"} />
                <TextInputBox setState={setAirlineStaffEmail} label={"Email:   (you can add more phone numbers after you register)"} requiredInput={false}  />
                <TextInputBox setState={setPhoneNumAS} label={"Phone Number: (optional)"} requiredInput={false} />

            </div>
        )}

    <button type="submit">Register </button>
    </form>


    <div>
      <p>{registerStatus}</p>
    </div>

    </div>
  );
};

export default RegisterForm;
