import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DisplayMap from './DisplayMap';
import DateInputBox from './DateInputBox';
import DateConverter from './DateConverter';
import Star from './Star';
import TextInputBox from './TextInputBox';


const CustomerHomePage = () => {
  const [displayFlights, setDisplayFlights] = useState(false);
  const [displaySpending, setDisplaySpending] = useState(false);
  const [flights, setFlights] = useState('')
  const [yearSpending, setYearSpending] = useState('')
  const [displayItems, setDisplayItems] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('');
  const [displayItemsCustom, setDisplayItemsCustom] = useState('');
  const [allowDisplayCustom, setAllowDisplayCustom] = useState(false);
  const [spendingCustom, setSpendingCustom] = useState('');
  const [cancelClicked, setCancelClicked] = useState('')
  const [cancelStatus, setCancelStatus] = useState('')
  const [displayReview, setDisplayReview] = useState(false)
  const [pastFlights, setPastFlights] = useState('')
  const [reviewClicked, setReviewClicked] = useState('')
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [addphoneNum, setAddPhoneNum] = useState('');
  const [displayAddPhone, setDisplayAddPhone] = useState(false);
  const [addPhoneStatus, setAddPhoneStatus] = useState('');
  

  const handleAddPhoneNum = async () => {
    if (addphoneNum === '') {
      alert("Please Enter a Phone Number");
    }
    else{
      const response = await fetch('addPhoneCust', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            'Phone_Number': addphoneNum,
        })
     })
      if (response.status ===200){
        setAddPhoneStatus("Phone Number Added");
      }
      else if (response.status === 600){
        setAddPhoneStatus("Action not Authorized");
      }
      else if (response.status === 700){
        setAddPhoneStatus("Phone Number Already Exists");
      }
      else{
        setAddPhoneStatus("Phone Number Submission Failed");
      }
    }
  }

  const handleDisplayAddPhoneNum = (e) =>{
    e.preventDefault();
    setDisplayAddPhone((displayAddPhone) => !displayAddPhone );
  }



  const handleSubmitReview = async () => {
    if (reviewClicked === ''){
      alert("Please Select a Flight to Review");
    }
    else if (selectedStars === 0 && reviewComment === ""){
      alert("Please Leave Some Review");
    }
    else{
      const response = await fetch('leaveReview', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            'stars': selectedStars,
            'comment': reviewComment,
            'flightNum': reviewClicked['Flight_Number'],
            'airlineName': reviewClicked['Airline_Name'],
            'depart' : DateConverter(reviewClicked['Departure_Date_Time']),
            
        })
     })
      if (response.status ===200){
          setReviewStatus("Review Submitted, Thanks!")
      }
      else{
        setReviewStatus("Review Submission Failed")
      
      }
    }
  }

  const handleStarClick = (selected) => {
    setSelectedStars(selected);
  };

  const handleDisplayReview = async () => {

    if (!displayReview){
      try {
        
        const response = await fetch('/getPastFlights', { method: 'GET' });

        if (!response.ok) {
          console.log("ERROR");
        }
        const responseJson = await response.json();
        setPastFlights(responseJson);

      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    }
    else{
      setSelectedStars(0)
      setReviewComment('')
      setReviewClicked('')
    }
    setDisplayReview((displayReview) => !displayReview );

  }
  const handleCancelFlight = async() => {
    if (cancelClicked === ""){
      alert("Please Select a Flight to Cancel");
    }
    else{
      const response = await fetch('cancelFlight', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            'Ticket_ID': cancelClicked['Ticket_ID'],
            
        })
     })
      if (response.status ===200){
        setCancelStatus("Flight Canceled")
        const newFlights = flights.filter(item => item !== cancelClicked);
        setFlights(newFlights);
      }

    }
  }
  
  useEffect(() => {
    const getUserType = async () => {
      try {
        const response = await fetch('/getUserType', { method: 'GET' });

        if (!response.ok) {
          console.log("ERROR");
        }
        const userType = await response.json();
        console.log(userType)

      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };
    getUserType();
    
  }, []); 

  

  const handleCustomDates = async () =>{
    if (start==='' || end===''){
      alert('fill out both fields');
    }
  try{
    const response = await fetch('/getSpending', {
      method: 'POST',
      headers:{
          'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
          'start': start,
          'end':end,
      })
    });

    const responseJson = await response.json()
    if (response.status === 200){
      const spending = await responseJson['Spending'];

      setSpendingCustom(spending);
      delete responseJson['Spending'];
      const items =  Object.entries(responseJson);
      const neededEntries = items.reverse();

      console.log(neededEntries);

      setDisplayItemsCustom(neededEntries);
      setAllowDisplayCustom(true);
    }
    console.log("AGAasdaegG");
  }
  catch (error){
    console.log("OUENE")
    console.log(error);
    
  }
    
  }


  const handleDisplaySpending = async () => {

    if (!displaySpending){

      try{
        const response = await fetch('/getSpending', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'start': "",
                'end': "",
            })
          });
          const responseJson = await response.json()
          if (response.status === 200){
            const spending = await responseJson['Spending'];
            console.log("Spending", spending);
            setYearSpending(spending);
            delete responseJson['Spending']
            const items =  Object.entries(responseJson);
            const neededEntries = items.reverse();

            setDisplayItems(neededEntries);

          }
          else{
          }
        }
        catch (error){
          console.log("ERROR");
        }


    }
    else{
      setAllowDisplayCustom(false);
    }

    setDisplaySpending((displaySpending) => !displaySpending );

  }



  const handleDisplayFlights = async () => {
    

    if (!displayFlights){
      console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
      const response = await fetch('/getFlights', {
        method: 'GET'
      });

        if (response.ok) {
          const data = await response.json();
          setFlights(data);
          console.log(flights)
        } else {
          console.error('Failed to fetch flights:', response.statusText);
        }
    }

    setDisplayFlights((displayFlights) => !displayFlights );
  }

  return (
    <div>
      
        <div>
          <h1>Hello, Customer</h1>
          <Link to="/FlightSearch">
            <button>Purchase Tickets</button>
          </Link>
  
          <button onClick={handleDisplayFlights}>See/Cancel your flights (Toggle)</button>
          <button onClick={handleDisplaySpending}>See your spending (Toggle)</button>
          <button onClick={handleDisplayReview}>Leave a Review! (Toggle)</button>
          <button onClick={handleDisplayAddPhoneNum}>Add a phone number to your account (Toggle)</button>

        {displayAddPhone && (
          <div>
              <TextInputBox setState={setAddPhoneNum} label={"Phone Number:"} />
              <button onClick={handleAddPhoneNum}>Add Phone Number</button>
              <p>{addPhoneStatus}</p>
          </div>
        )}
         
  
          {displayFlights && (
            <div>
              <h1> Flights: </h1>
              <DisplayMap mapToDisplay={flights} clickable={true} setState={setCancelClicked} state={cancelClicked} />
              <button onClick={handleCancelFlight}>Press to Cancel Selected Flight</button>
              <p>{cancelStatus}</p>
            </div>
            
          )}
  
          {displaySpending && (
            <div>
              <h1> Spending: </h1>
              <p>Previous Year Spending: ${yearSpending}</p>
  
              <h2>Last 6 Month Spending Breakdown</h2>
              <table style={{ width: '50%', borderCollapse: 'collapse', margin: '20px' }}>
                <thead>
                  <tr>
                    <th>Date Range</th>
                    <th>Spending</th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>${value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
  
              <h2>See Spending on Custom Dates</h2>
  
              
                <DateInputBox setState={setStart} label={"Start of Range"} />
                <DateInputBox setState={setEnd} label={"End of Range"} />
                <button onClick={handleCustomDates}>Search</button>


             
                    

              {allowDisplayCustom && (
                <div>
                <p>Total Spent: ${spendingCustom === null ? 0 : spendingCustom}</p>
                <table style={{ width: '50%', borderCollapse: 'collapse', margin: '20px' }}>
                  <thead>
                    <tr>
                      <th>Date Range</th>
                      <th>Spending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItemsCustom.map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>${value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          )}


          {displayReview && (
            <div>
              <h1>Leave a Review!</h1>
              <DisplayMap mapToDisplay={pastFlights} clickable={true} setState={setReviewClicked} state={reviewClicked} />

              <p>Selected Stars: {selectedStars}</p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} selected={star <= selectedStars} onClick={() => handleStarClick(star)} />
                ))}
              <TextInputBox setState={setReviewComment} label={"Leave a comment!"} ></TextInputBox>
                  
              <button onClick={handleSubmitReview}> Review the selected flight</button>
              <p>{reviewStatus}</p>

            </div>
          )}
        </div>
      
      
    </div>
  );
  
};

export default CustomerHomePage