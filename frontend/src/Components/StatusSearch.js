import React, { useState,  } from 'react';


// //a. Search for future flights based on source city/airport name, destination city/airport name, 
// departure date for one way (departure and return dates for round trip).



// b. Will be able to see the flights status based on airline name, flight number, arrival/departure 
// date.


function StatusSearch() {
  // State to manage user input
  const [airlineName, setAirlineName] = useState('');
  const [flightNum, setFlightNum] = useState('');
  const [departDate, setDepartDate] = useState('0000-00-00');
  const [status, setStatus] = useState("");
 


  const handleSubmit = async(e) => {
    e.preventDefault();

    const response = await fetch('/StatusSearch', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            'AirlineName': airlineName,
            'FlightNum': flightNum,
            'DepartDate': departDate,

        })
      });
      const responseData = await response.json();
      console.log(responseData);
      // console.log(responseData['Flights']);

      if (response.status === 200){
        setStatus(responseData['Flight_status']);
      }
      else {// (response.status === 400)
        setStatus("Flight does not exist");
      }
}


  return (
    <div>
    <form onSubmit={handleSubmit} className='SearchBox'>
      <div>
        <label htmlFor="airlineName">Airline Name:</label>
        <input
          className='inputBox'
          type="text"
          id="airlineName"
          value={airlineName}
          onChange={(e) => setAirlineName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="flightNum">Flight Number:</label>
        <input
          className='inputBox'
          type="text"
          id="flightNum"
          value={flightNum}
          onChange={(e) => setFlightNum(e.target.value)}
          required
        />
      </div>

      <div>
      <label htmlFor="dateInput">Departure Date :</label>
      <input
        className='inputBox'
        type="date"
        id="departDate"
        value={departDate}
        onChange={(e) => setDepartDate(e.target.value)}
        pattern="\d{4}-\d{2}-\d{2}"
        required
      />
        </div>


      <button type="submit">Search Flight Status</button>

      <div>
      <p>{status}</p>
    </div>
    
    </form>

    


    </div>
  
  );
}


export default StatusSearch;
