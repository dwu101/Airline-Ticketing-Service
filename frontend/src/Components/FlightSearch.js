import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextInputBox from './TextInputBox';
import DateInputBox from './DateInputBox';
import DateConverter from './DateConverter';


const FlightSearch = ({isloggedin}) => {
  console.log('isLogged', isloggedin);
  
  // State to manage user input
  const [departAirport, setDepartAirport] = useState('');
  const [arriveAirport, setArriveAirport] = useState('');
  const [departDate, setDepartDate] = useState('0000-00-00');
  const [returnDate, setReturnDate] = useState('0000-00-00');
  const [tripType, setTripType] = useState('');
  const [way1Flights, setWay1Flights] = useState(null);
  const [way2Flights, setWay2Flights] = useState(null);
  const [allAirports, setAllAirports] = useState([]);
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [purchase, setPurchase] = useState(false);
  const [cardType, setCardType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [purchaseResult, setPurchaseResult] = useState('');
  const[firstName, setFirstName] = useState('');
  const[lastName, setLastName] = useState('');
  const[DOB, setDOB] = useState('');
  const [isFull1, setIsFull1] = useState('');
  const [isFull2, setIsFull2] = useState('');

  const [way1Clicked, setWay1Clicked] = useState('');
  const [way2Clicked, setWay2Clicked] = useState('');



  const handleWay1Click = (clickedItem) => {
    console.log(clickedItem)
    setWay1Clicked(clickedItem);
  };
  const handleWay2Click = (clickedItem2) => {
    setWay2Clicked(clickedItem2);
  };

  const handleTransaction = async(e) =>{
    e.preventDefault();

    if (way1Clicked === '') {
      setPurchaseResult("Please Enter all Flight Information");
      return
    }

    if(tripType === "Round-Trip" && way2Clicked === ''){
      setPurchaseResult("Please Enter all Flight Information");
      return
    }

    // flightNum = data['flightNum']
    // airline = data['airline']
    // departure = data['departure']
    
    const result = await fetch('/increaseTicketPrice',{
      method: 'POST',
      headers:{
          'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        'flightNum' : way1Clicked['Flight_Number'],
        'airline' : way1Clicked['Airline_Name'],
        'departure' : DateConverter(way1Clicked['Departure_Date_Time'])
      })
    
    });
    if (result.status === 400){
      setPurchaseResult("ERROR IN TRANSACTION");
    }
    else{
      const priceIncrease = await result.json();
      console.log(priceIncrease);
      if (priceIncrease['Increase']){
        const newFlight = new Map(way1Clicked);
        newFlight.set('Base_Price', way1Clicked['Base_Price']*1.25);
        setWay1Clicked(newFlight);
      }
      setIsFull1(priceIncrease['Full']);
        console.log("Isfull1", isFull1);

      if (tripType === "Round-Trip"){
            const Way2Result = await fetch('/increaseTicketPrice',{
              method: 'POST',
              headers:{
                  'Content-Type' : 'application/json'
              },
              body: JSON.stringify({
                'flightNum' : way2Clicked['Flight_Number'],
                'airline' : way2Clicked['Airline_Name'],
                'departure' : DateConverter(way2Clicked['Departure_Date_Time'])
              })
            
            });
            if (Way2Result.status=== 400){
              setPurchaseResult("ERROR IN TRANSACTION");
            }
            else{
              const priceIncrease = await Way2Result.json();
              if (priceIncrease['Increase']){
                const newFlight = new Map(way2Clicked);
                newFlight.set('Base_Price', way2Clicked['Base_Price']*1.25);
                setWay2Clicked(newFlight);
              }
              else{

              }
              setIsFull2(priceIncrease['Full']);
              console.log("Isfull2", isFull2);
            }

      }
    }
    // email = session[0]
    // flightNum = data['flightNum']
    // departure = data['departure']
    // price = data['price']
    // cardType = data['cardType']
    // cardNumber = data['cardNumber']
    // cardName = data['cardName']
    // cardExp = data['cardExp']
    try{
      console.log("CARDEXP", cardExp);
      const response = await fetch('/buyTicket', {
          method: 'POST',
          headers:{
              'Content-Type' : 'application/json'
          },
          body: JSON.stringify({ //TICKET ID WILL BE RNG (CHECK), EMAIL ADDRESS FROM SESSION
              'cardType': cardType,
              'cardNumber': cardNumber,
              'cardName': cardName,
              'cardExp': cardExp,
              'flightNum' : way1Clicked['Flight_Number'],
              'departure' : DateConverter(way1Clicked["Departure_Date_Time"]),
              'price': way1Clicked["Real_Price"], //ADJUST PRICE
              'firstName' : firstName,
              'lastName' : lastName,
              'DOB' : DOB,
              'full' : isFull1
          })
        });
        
        if (response.status === 200){
          setPurchaseResult("Ticket Bought Successfully");
        
        }
        else {// (response.status === 400)
          setPurchaseResult("Error in Transaction");
        }

        if(way2Clicked){
            try{
              const response = await fetch('/buyTicket', {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ //TICKET ID WILL BE RNG (CHECK), EMAIL ADDRESS FROM SESSION
                    'cardType': cardType,
                    'cardNumber': cardNumber,
                    'cardName': cardName,
                    'cardExp': cardExp,
                    'flightNum' : way2Clicked['Flight_Number'],
                    'departure' : DateConverter(way2Clicked["Departure_Date_Time"]),
                    'price': way2Clicked["Real_Price"], 
                    'firstName' : firstName,
                    'lastName' : lastName,
                    'DOB' : DOB,
                    'full' : isFull2

                })
                
              });
              
              if (response.status === 200){
                setPurchaseResult("Ticket Bought Successfully");
              }
              else if (response.status===405){
                const errorData = await response.text()
                setPurchase(errorData)
              }
              else {// (response.status === 400)
                setPurchaseResult("Error in Transaction");
              }
            }
              catch (error){
                console.log("ERROR", error)
              }

          }
    
        }
        catch (error){
          console.log("ERROR", error)
        }
      }


  const allowPurchase = () => {
    setPurchase(true);
  }
  const handleSubmit = async(e) => {
    console.log("POOOOOP: ");
    console.log(isloggedin);
    e.preventDefault();

    
  try{
    const response = await fetch('/FlightSearch', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            'DepartAirport': departAirport,
            'ArriveAirport': arriveAirport,
            'DepartDate': departDate,
            'ReturnDate': returnDate,
            'TripType' : tripType

        })
      });
      const responseData = await response.json();
      console.log(responseData);
      console.log(responseData['Flights']);

      if (response.status === 200){
        setResult("");
        setWay1Flights(responseData["Way1"]); 
        setWay2Flights(responseData["Way2"]);
        setShowResult(true);
      }
      else {// (response.status === 400)
        setResult("No Flights Found");
        setWay1Flights(null);
        setWay2Flights(null);
      }
    }
    catch (error){
      console.log("ERROR", error)
    }

      
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/getAirports');
      const data = await response.json();
      setAllAirports(data['Airports']);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 99000);

    return () => clearInterval(intervalId);
  }, []); 


  return (
    <div className='SearchBox'>
    <form onSubmit={handleSubmit} >


    <div className='inputBox'>
        <label>Select a Departure Airport or Departure City</label>
        <select value={departAirport} onChange={(e) => setDepartAirport(e.target.value)}>
        <option value=""> Select an option</option>
            {allAirports.map(item => (
        <option key={item.Airport_Name || item.City} value={item.Airport_Name || item.City}>
            {item.Airport_Name || item.City}
        </option>
      ))}
      </select>
    </div>

    <div className='inputBox'>
        <label>Select an Arrival Depature Airport or Arrival City</label>
        <select value={arriveAirport} onChange={(e) => setArriveAirport(e.target.value)}>
          <option value="">Select an option</option>
            {allAirports.map(item => (
          <option key={item.Airport_Name || item.City} value={item.Airport_Name || item.City}>
            {item.Airport_Name || item.City}
          </option>
          ))}
        </select>
    </div>
      
      <div className='inputBox'>
        <label >One-Way or Round Trip?</label>
        <select onChange={(e) => setTripType(e.target.value)} required>
          <option value="">Select...</option>
          <option value="One-Way">One-Way</option>
          <option value="Round-Trip">Round-Trip</option>
        </select>
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

        

    {tripType === "Round-Trip" && (
        <div>
      <label htmlFor="dateInput">Return Date :</label>
      <input
        className='inputBox'
        type="date"
        id="returnDate"
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
        pattern="\d{4}-\d{2}-\d{2}"
        required/>
        </div>
    )}
        


      <button type="submit">Search Flight</button>


    </form>
    <p>{result}</p>
    {showResult && (
    <div>
  
      <p>{result}</p>
      <h2>Departure</h2>

      {way1Flights && (
          <ul>
            {way1Flights.map((item, index) => (
              <li key={index} onClick={() => handleWay1Click(item)} style={{
                cursor: 'pointer',
                color: way1Clicked === item ? 'red' : 'black',
              }}>
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} >
                    <strong>{key}:</strong> {value}<br /> 
                  </div>
                  
                ))}
              </li>
          ))}
          </ul>
      )}
    

    <div>
      <h2>Return</h2>

      {way2Flights && (
          <ul>
            {way2Flights.map((item, index) => (
             <li key={index} onClick={() => handleWay2Click(item)} style={{
              cursor: 'pointer',
              color: way2Clicked === item ? 'red' : 'black',
            }}>
                {Object.entries(item).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}<br />
                  </div>
                ))}
              </li>
          ))}
          </ul>
      )}
    </div>
    

    {isloggedin&& (
    <div>
        <button onClick={allowPurchase}> Purchase A Flight </button>
    </div> 
    )}

    {!isloggedin && (
    <div>
     <Link to ="/Login">
        <button > Log in or Register to Purchase a Flight </button>
       </Link>
     </div> 
    )}
    


    {purchase && (
      <div>

        <form onSubmit={handleTransaction} >

        <TextInputBox setState={setCardType} label= {"Card Type"}/>
        <TextInputBox setState={setCardNumber} label= {"Card Number"}/>
        <TextInputBox setState={setCardName} label= {"Card Holder Name"}/>
        <DateInputBox setState={setCardExp} label= {"Card Expiration"}/>

        <TextInputBox setState={setFirstName} label= {"First Name of Ticket Holder"}/>
        <TextInputBox setState={setLastName} label= {"Last Name of Ticket Holder"}/>
        <DateInputBox setState={setDOB} label= {"DOB of Ticket Holder"}/>

        <button type="submit">Buy</button>

        </form>


      </div>
    )}


      <p>{purchaseResult}</p>































    </div>
    )}

  
    </div> 
  );
  
 
};

FlightSearch.propTypes = {
  isloggedin: PropTypes.bool.isRequired,
};

export default FlightSearch;
