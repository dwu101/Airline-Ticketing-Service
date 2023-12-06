import React from "react";
import { useState, useEffect } from "react";
import DisplayMap from "./DisplayMap";
import DateInputBox from "./DateInputBox";
import TextInputBox from "./TextInputBox";
import DropdownFlights from "./DropdownFlights";
import DropdownGeneral from "./DropdownGeneral";
import DateConverter from "./DateConverter";


const AirlineStaffHomePage = () => {
    const [flightNumberNew, setFlightNumber] = useState('');
    const [departureDateTimeNew, setDepartureDateTimeNew] = useState('');
    const [airlineNameNew, setAirlineNameNew] = useState('');
    const [airplaneIDNew, setAirplaneIDNew] = useState('');
    const [arrivalDateTimeNew, setArrivalDateTimeNew] = useState('');
    const [basePriceNew, setBasePriceNew] = useState('');
    const [arrivesAtNew, setArrivesAtNew] = useState('');
    const [departsFromNew, setDepartsFromNew] = useState('');
    const [flightStatusNew, setFlightStatusNew] = useState('');
    const [addFlightStatus, setAddFlightStatus] = useState('');

    const [futureFlights, setFutureFlights] = useState('');
    const [futureFlightsMessage, setFutureFlightsMessage] = useState('');
    const [futureFlightsCustom, setFutureFlightsCustom] = useState(''); 
    const [futureFlightsCustomMessage, setFutureFlightsCustomMessage] = useState('');

    const [displayFutureFlightsToggle, setDisplayFutureFlightsToggle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [sourceAirport1, setSourceAirport1] = useState('');
    const [destinationAirport1, setDestinationAirport1] = useState('');
    const [sourceAirport2, setSourceAirport2] = useState('');
    const [destinationAirport2, setDestinationAirport2] = useState(''); 
    const [allAirports, setAllAirports] = useState('');
    const [flightNumSearch, setFlightNumSearch] = useState('');
    const [flightClicked, setFlightClicked] = useState('');

    const[seeCustomersStatus, setSeeCustomersStatus] = useState('');
    const [customers, setCustomers] = useState('');
    const [displayCustomers, setDisplayCustomers] = useState('');

    const [displayChangeStatusToggle, setDisplayChangeStatusToggle] = useState(false);
    const [flightNumberSC, setFlightNumberSC] = useState('');
    const [departureDateTimeSC, setDepartureDateTimeSC] = useState('');
    const [flightStatusSC, setFlightStatusSC] = useState('');
    const [changeStatusStatus, setChangeStatusStatus] = useState('');
    
    const [displayAddPlaneToggle, setDisplayAddPlaneToggle] = useState(false);
    const [airplaneID, setAirplaneID] = useState('');
    const [seatCount, setSeatCount] = useState('');
    const [manufacturingCompany, setManufacturingCompany] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [manufacturingDate, setManufacturingDate] = useState('');
    const [addPlaneStatus, setAddPlaneStatus] = useState('');

    const [displayAddAirportToggle, setDisplayAddAirportToggle] = useState(false);
    const [airportCode, setAirportCode] = useState('');
    const [airportName, setAirportName] = useState('');
    const [airportCity, setAirportCity] = useState('');
    const [airportCountry, setAirportCountry] = useState('');
    const [airportNumTerminals, setAirportNumTerminals] = useState('');
    const [airportType, setAirportType] = useState('');
    const [addAirportStatus, setAddAirportStatus] = useState('');

    const [displayRatingsComments, setDisplayRatingsComments] = useState(false);
    const [ratingsComments, setRatingsComments] = useState('');
    const [ratingsCommentsStatus, setRatingsCommentsStatus] = useState('');
    const [averageRating, setAverageRating] = useState('');

    const [displayAddMaintenanceToggle, setDisplayAddMaintenanceToggle] = useState(false);
    const [maintAirplaneID, setMaintAirplaneID] = useState('');
    const [maintStartDate, setMaintStartDate] = useState('');
    const [maintEndDate, setMaintEndDate] = useState('');
    const [schedMaintStatus, setSchedMaintStatus] = useState(''); 

    const [displayRevToggle, setDisplayRevToggle] = useState(false);
    const [revMonth, setRevMonth] = useState('');
    const [revYear, setRevYear] = useState('');

    const [displayCustomerSearchToggle, setDisplayCustomerSearchToggle] = useState(false);
    const [customerEmailSearch, setCustomerEmailSearch] = useState('');
    const [customerSearchStatus, setCustomerSearchStatus] = useState('');
    const [customerFlightsResult, setCustomerFlightsResult] = useState('');
    const [mostFrequentCustomer, setMostFrequentCustomer] = useState('');
    const [displayCustomerCustom, setDisplayCustomerCustom] = useState(false);

    const [displayAddToggle, setDisplayAddToggle] = useState(false);
    const [addPhone, setAddPhone] = useState('');
    const [addEmail, setAddEmail] = useState('');
    const [addPhoneStatus, setAddPhoneStatus] = useState('');
    const [addEmailStatus, setAddEmailStatus] = useState('');
    
    const handleAddEmail = async(e) => {
        e.preventDefault();
        if (addEmail === '') {
            alert("Please enter an email.");
            return;
        }
        const response = await fetch('/addEmail', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'email': addEmail
            })
        });
        if (response.status === 600){
            setAddEmailStatus("You are not authorized for this action.");
        }
        else if (response.status === 200){
            setAddEmailStatus("Email added.");
        }
        else if (response.status===700){
            setAddEmailStatus("Email already exists");
        }
        else{
            setAddEmailStatus("Error adding email.");
        }
    }

    const handleAddPhone = async(e) => {
        e.preventDefault();
        if (addPhone === '') {
            alert("Please enter a phone number.");
            return;
        }
        const response = await fetch('/addPhoneAS', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'phoneNum': addPhone
            })
        });
        if (response.status === 600){
            setAddPhoneStatus("You are not authorized for this action.");
        }
        else if (response.status === 200){
            setAddPhoneStatus("Phone number added.");
        }
        else if (response.status===700){
            setAddPhoneStatus("Phone Number already exists");
        }
        else{
            setAddPhoneStatus("Error adding phone number.");
        }
    }

    const handleAddDisplay = async(e) => {
        e.preventDefault();
        setDisplayAddToggle((displayAddToggle) => !displayAddToggle );
    }
    const handleCustomerSearch = async(e) => {
        e.preventDefault();
        if (customerEmailSearch === '') {
            alert("Please enter a username.");
            return;
        }
        const response = await fetch('/customerSearch', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'email': customerEmailSearch
            })
        });
        const data = await response.json();
        if (data.length === 0){
            setCustomerSearchStatus("No customer found with that username.");
        }
        else{
            setCustomerFlightsResult(data);
            setDisplayCustomerCustom(true);
            setCustomerSearchStatus("");

        }
    }
    const displayCustomerSearch = async(e) => {
        e.preventDefault();
        if (!displayCustomerSearchToggle){
            const response = await fetch('/mostFrequentCustomer', {
                method: 'GET',
                headers:{
                    'Content-Type' : 'application/json'
                },
            });
            if (response.status === 600){
                setCustomerSearchStatus("You are not authorized for this action.");
            }
            else{
                const data = await response.json();
                if (data){
                    setMostFrequentCustomer(data);
                    
                }
            }
        }
        setDisplayCustomerSearchToggle((displayCustomerSearchToggle) => !displayCustomerSearchToggle );
    }

    const handleDisplayRev = async(e) => {
        e.preventDefault();
        if (!displayRevToggle){
            const response = await fetch('/getRev', {
                method: 'GET',
                headers:{
                    'Content-Type' : 'application/json'
                },
            }); 
            if (response.status === 600){
                setRevMonth("You are not authorized for this action.");
            }
            const data = await response.json();
            setRevMonth(data['month']);
            setRevYear(data['year']);

        }
        setDisplayRevToggle((displayRevToggle) => !displayRevToggle );
    }


    const handleSchedMaint = async(e) => {
        e.preventDefault();
        if (maintAirplaneID === '' || maintStartDate === '' || maintEndDate === ''){
            alert("Please enter all values.");
            return;
        }
        const response = await fetch('/schedMaint', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'airplaneID': maintAirplaneID,
                'startDate': DateConverter(maintStartDate, true),
                'endDate': DateConverter(maintEndDate, true)
            })
        });
        if (response.status === 600){
            setSchedMaintStatus("You are not authorized for this action.");
        }
        if (response.status === 200){
            setSchedMaintStatus("Maintenance scheduled.");
        }
        else{
            setSchedMaintStatus("Error scheduling maintenance.");
        }
    }

    const displaySchedMaint = (e) => {
        e.preventDefault();
        setDisplayAddMaintenanceToggle((displayAddMaintenanceToggle) => !displayAddMaintenanceToggle );
    }

    const seeRatingsComments = async (e) => {
        e.preventDefault();

        if (flightClicked === ''){
            alert("Please select a flight.");
            return;
        }

        const response = await fetch('/seeRatingsComments', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'flightNum': flightClicked['Flight_Number'],
                'depart': DateConverter(flightClicked['Departure_Date_Time']),
            })
        });
        const data = await response.json();
        console.log(data);
        
        if (data.length === 0){
            setRatingsCommentsStatus("No customers found for this flight.");
        }
        else{
            setRatingsCommentsStatus("");
            setRatingsComments(data['ratingsComments']);
            setAverageRating(data['avgRating']);
        }

        setDisplayRatingsComments((displayRatingsComments) => !displayRatingsComments );
    }

    const handleAddAirport = async(e) => {
        e.preventDefault();
        if (airportCode === '' || airportName === '' || airportCity === '' || airportCountry === '' || airportNumTerminals === '' || airportType === ''){
            alert("Please enter all values.");
            return;
        }
        const response = await fetch('/addAirport', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'airportCode': airportCode,
                'airportName': airportName,
                'airportCity': airportCity,
                'airportCountry': airportCountry,
                'airportNumTerminals': airportNumTerminals,
                'airportType': airportType
            })
        });
        if (response.status === 600){
            setAddAirportStatus("You are not authorized for this action.");
        }
        if (response.status === 200){
            setAddAirportStatus("Airport created.");
        }
        else{
            setAddAirportStatus("Error creating airport.");
        }
    }

    const displayAddAirport = (e) => {
        e.preventDefault();
        setDisplayAddAirportToggle((displayAddAirportToggle) => !displayAddAirportToggle );
    }

    const handleNewPlane = async(e) => {
        e.preventDefault();
        if (airplaneID === '' || seatCount === '' || manufacturingCompany === '' || modelNumber === '' || manufacturingDate === ''){
            alert("Please enter all values.");
            return;
        }
        const response = await fetch('/addAirplane', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'airplaneID': airplaneID,
                'seatCount': seatCount,
                'manufacturingCompany': manufacturingCompany,
                'modelNumber': modelNumber,
                'manufacturingDate': DateConverter(manufacturingDate, true)
            })
        });
        if (response.status === 600){
            setAddPlaneStatus("You are not authorized for this action.");
            
        }
        if (response.status === 200){
            setAddPlaneStatus("Airplane created.");
            
        }
        else{
            setAddPlaneStatus("Error creating airplane.");
            
        }
    }
    const displayAddPlane = (e) => {
        e.preventDefault();
        setDisplayAddPlaneToggle((displayAddPlaneToggle) => !displayAddPlaneToggle );
    }

    const handleChangeStatus = async(e) => {
        e.preventDefault();
        if (flightNumberSC === '' || departureDateTimeSC === '' || flightStatusSC === '') {
            alert("Please enter all values.");
            return;
        }
        const response = await fetch('/changeFlightStatus', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'flightNumber': flightNumberSC,
                'departureDateTime': DateConverter(departureDateTimeSC, true),
                'status': flightStatusSC
            })
        });
        if (response.status === 600){
            setChangeStatusStatus("You are not authorized for this action.");
            
        }
        if (response.status === 200){
            setChangeStatusStatus("Flight status changed.");
            
        }
        else{
            setChangeStatusStatus("Error changing flight status.");
            
        }
    }

    const displayChangeStatus = (e) => {
        e.preventDefault();

        setDisplayChangeStatusToggle((displayChangeStatusToggle) => !displayChangeStatusToggle );
    }
    const handleNewFlight = async(e) => {
        e.preventDefault();
        if (flightNumberNew === '' || departureDateTimeNew === '' || airlineNameNew === '' || airplaneIDNew === '' || arrivalDateTimeNew === '' || basePriceNew === '' || arrivesAtNew === '' || departsFromNew === '' || flightStatusNew === ''){
            alert("Please enter all values.");
            return;

        }
        const response = await fetch('/addFlight', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'flightNumber': flightNumberNew,
                'departureDateTime': DateConverter(departureDateTimeNew, true),
                'airlineName': airlineNameNew,
                'airplaneID': airplaneIDNew,
                'arrivalDateTime': DateConverter(arrivalDateTimeNew, true),
                'basePrice': basePriceNew,
                'arrivesAt': arrivesAtNew,
                'departsFrom': departsFromNew,
                'status': flightStatusNew
            })
        });
        if (response.status === 600){
            setAddFlightStatus("You are not authorized for this action.");  
        }
        if (response.status === 200){
            setAddFlightStatus("Flight created.");
        }
        if (response.status === 700){
            setAddFlightStatus("Airplane is in Maintenance.");
        }
        else{
            setAddFlightStatus("Error creating flight.");
        }

    }
    const transformMapValue = (item) => {
        const firstName = item["First_Name"] ;
        const lastName = item["Last_Name"];
        return `${firstName} ${lastName}`;
      };
    
    const seeCustomers = async() =>{
        if (flightClicked === ''){
            alert("Please select a flight.");
            return;
        }
        const response = await fetch('/seeCustomers', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'flightNum': flightClicked['Flight_Number'],
                'depart': DateConverter(flightClicked['Departure_Date_Time']),
            })
        });
        const data = await response.json();
        console.log(data);
        setCustomers(data);
        if (data.length === 0){
            setSeeCustomersStatus("No customers found for this flight.");
            setDisplayCustomers(false);
        }
        else{
            setSeeCustomersStatus("");
            setDisplayCustomers(true);
        }

    }
    
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


    const displayFutureFlights = async(e) => {
        e.preventDefault();
        if (!displayFutureFlightsToggle){
            const response = await fetch('/DefaultFutureFlightsAS', {
                method: 'GET',
                headers:{
                    'Content-Type' : 'application/json'
                },
            });
            if (response.status === 600){
                setFutureFlightsMessage("You are not authorized for this action.");
            }
            const data = await response.json();
            setFutureFlights(data);
            if (data.length === 0){
                setFutureFlightsMessage("No future flights found.");
            }
            else{
                setFutureFlightsMessage("");
            }
        }
        else{
            setFutureFlightsMessage("");
            setFutureFlights('');
            setStart('');
            setEnd('');
            setSourceAirport1('');
            setDestinationAirport1('');
            setSourceAirport2('');
            setDestinationAirport2('');
            setFutureFlightsCustom('');
        }
        setDisplayFutureFlightsToggle((displayFutureFlightsToggle) => !displayFutureFlightsToggle );
    }

    const handleSubmitCustom = async( e,submitType) => {
        console.log("submit",submitType);
        e.preventDefault();
        if (submitType === 'dateRange' && (start === '' || end === '')){
            alert("Please enter a start and end date.");
            return;
        }
        else if (submitType === 'sourceSearch' && sourceAirport1 === ''){
            alert("Please enter a source airport/city.");
            return;
        }
        else if (submitType === 'destinationSearch' && destinationAirport1 === ''){
            alert("Please enter a destination airport/city.");
            return;
        }
        else if (submitType === 'sourceDestinationSearch' && (sourceAirport2 === '' || destinationAirport2 === '')){
            alert("Please enter a source and destination airport/city.");
            return;
        }
        else if (submitType === 'flightNumSearch' && flightNumSearch === ''){
            alert("Please enter a flight number.");
            return;
        }
        
        const response = await fetch('/CustomFutureFlightsAS', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                'submitType': submitType,
                'start': start,
                'end': end,
                'source1': sourceAirport1,
                'destination1': destinationAirport1,
                'source2': sourceAirport2,
                'destination2': destinationAirport2,
                'flightNum': flightNumSearch
            })
        });
        
    
        if (response.status === 600){
            setFutureFlightsMessage("You are not authorized for this action.");
        }
        const data = await response.json();
        
        console.log(data)
        if (data.length === 0){
            setFutureFlightsCustomMessage("No future flights found with the given parameters.");
        }  
        else{
            setFutureFlightsCustomMessage("");
        }
        setFutureFlightsCustom(data);
    }











  return (
    <div>
      <h1>Airline Staff Home Page</h1>
        <button onClick={displayFutureFlights} style = {{marginLeft:'10px'}}>Display Future Flights and Create new Flights </button>
        <button onClick={displayChangeStatus} style = {{marginLeft:'10px'}}>Change Flight Status </button>
        <button onClick={displayAddPlane} style = {{marginLeft:'10px'}}>Add an Airplane </button>
        <button onClick={displayAddAirport} style = {{marginLeft:'10px'}}>Add an Airport </button>
        <button onClick={displaySchedMaint} style = {{marginLeft:'10px'}}>Schedule Maintenance </button>
        <button onClick={handleDisplayRev} style = {{marginLeft:'10px'}}>See Airline Revenue </button>
        <button onClick={displayCustomerSearch} style = {{marginLeft:'10px'}}>See Customer Information </button>
        <button onClick={handleAddDisplay} style = {{marginLeft:'10px'}}>Add Phone Number or Email to your account </button>

        {displayAddToggle && (
            <div>
                <h1>Add Phone Number or Email</h1>
                <TextInputBox setState={setAddPhone} label={"Phone Number:"} />
                <button onClick={handleAddPhone}>Add Phone Number</button>
                <p>{addPhoneStatus}</p>

                <TextInputBox setState={setAddEmail} label={"Email:"} />
                <button onClick={handleAddEmail}>Add Email</button>
                <p>{addEmailStatus}</p>


            </div>

        )}

        {displayCustomerSearchToggle && (
            <div>
                <h1>Customer Search</h1>
                <h2>Most Frequent Customer</h2>
                <DisplayMap mapToDisplay={mostFrequentCustomer} clickable={false} />
                

                <h2>Customer Search</h2>
                <TextInputBox setState={setCustomerEmailSearch} label={"Customer Email:"} />
                <button onClick={handleCustomerSearch}>Search</button>
                <p>{customerSearchStatus}</p>
                {displayCustomerCustom && (<DisplayMap mapToDisplay={customerFlightsResult} clickable={false} />)}
            </div>
        )}
        {displayRevToggle && (  
            <div>
                <h1>Revenues</h1>
                <h3>Last month's revenue: ${revMonth}</h3>
                <h3>Last year's revenue: ${revYear}</h3>
            </div>
        )}

        {displayAddMaintenanceToggle && (
            <div>
                <h1>Schedule Maintanance</h1>
                <TextInputBox setState={setMaintAirplaneID} label={"Airplane ID:"} />
                <DateInputBox setState={setMaintStartDate} label={"Start Date and Time:"} hasTime={true}/>
                <DateInputBox setState={setMaintEndDate} label={"End Date and Time:"} hasTime={true}/>
                <button onClick={handleSchedMaint}>Schedule Maintenance</button>
                <p>{schedMaintStatus}</p>
            </div>
        )}

        {displayAddPlaneToggle && (
            <div>
                <h1>Add Airplane</h1>
                <TextInputBox setState={setAirplaneID} label={"Airplane ID:"} />
                <TextInputBox setState={setSeatCount} label={"Seat Count:"} />
                <TextInputBox setState={setManufacturingCompany} label={"Manufacturing Company:"} />
                <TextInputBox setState={setModelNumber} label={"Model Number:"} />
                <DateInputBox setState={setManufacturingDate} label={"Manufacturing Date:"} hasTime={false}/>
                <button onClick={handleNewPlane}>Submit New Airplane</button>
                <p>{addPlaneStatus}</p>
            </div>
        )}

        {displayAddAirportToggle && (
            <div>
                <h1>Add Airport</h1>
                <TextInputBox setState={setAirportCode} label={"Airport Code:"} />
                <TextInputBox setState={setAirportName} label={"Airport Name:"} />
                <TextInputBox setState={setAirportCity} label={"Airport City:"} />
                <TextInputBox setState={setAirportCountry} label={"Airport Country:"} />
                <TextInputBox setState={setAirportNumTerminals} label={"Number of Terminals:"} />
                <TextInputBox setState={setAirportType} label={"Airport Type:"} />
                <button onClick={handleAddAirport}>Submit New Airport</button>
                <p>{addAirportStatus}</p>
            </div>
        )}


        {displayChangeStatusToggle && (
            <div>
                <h1>Change Flight Status</h1>
                <TextInputBox setState={setFlightNumberSC} label={"Flight Number:"} />
                <DateInputBox setState={setDepartureDateTimeSC} label={"Departure Date and Time:"} hasTime={true}/>
                <DropdownGeneral items={['on-time', 'delayed', 'cancelled']} setState={setFlightStatusSC} state ={flightStatusSC} label={"Change Flight Status to:"} />
            
                <button onClick = {handleChangeStatus}>Submit Change</button>

                <p>{changeStatusStatus}</p>
            </div>

        )}

        {displayFutureFlightsToggle && (
            <div>  
                <h1>Future Flights Within 30 Days</h1>
                <p>{futureFlightsMessage}</p>
                <DisplayMap mapToDisplay={futureFlights} clickable={false} />

                <h1>Custom Range for Flights</h1>
            
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ marginLeft: '10px' }}>
                <DateInputBox setState={setStart} label={"Start of Range"} />
                <DateInputBox setState={setEnd} label={"End of Range"} />
                <button onClick={(e) => handleSubmitCustom(e,'dateRange')}>Search by Date Range</button>
            </div>

            <div style={{ marginLeft: '10px' }}>
                <DropdownFlights items={allAirports} setState={setSourceAirport1} state ={sourceAirport1} label={"Source Airport/City"} />
                <button onClick={(e) => handleSubmitCustom(e, 'sourceSearch')}>Search by Source Airport/City</button>
            </div>

            <div style={{ marginLeft: '10px' }}>
                <DropdownFlights items={allAirports} setState={setDestinationAirport1} state ={destinationAirport1} label={"Destination Airport/City"} />
                <button onClick={(e) => handleSubmitCustom(e,'destinationSearch')}>Search by Destination Airport/City</button>
            </div>

            <div style={{ marginLeft: '10px' }}>
                <DropdownFlights items={allAirports} setState={setSourceAirport2} state ={sourceAirport2} label={"Source Airport/City"} />
                <DropdownFlights items={allAirports} setState={setDestinationAirport2} state ={destinationAirport2} label={"Destination Airport/City"} />
                <button onClick={(e) => handleSubmitCustom(e,'sourceDestinationSearch')}>Search by Source/City and Destination Airport/City</button>
            </div>

            <div style={{ marginLeft: '10px' }}>
                <TextInputBox setState={setFlightNumSearch} label={"Flight Number"} />
                <button onClick={(e) => handleSubmitCustom(e,'flightNumSearch')}>Search by Flight Number</button>
            </div>

            
        </div>

            {futureFlightsCustom &&(
                <div>
                    <p>{futureFlightsCustomMessage}</p>
                    <DisplayMap mapToDisplay ={futureFlightsCustom} clickable={true} setState={setFlightClicked} state={flightClicked}></DisplayMap>
                    {!displayCustomers && (<p>Click Flight to See Customers and/or Ratings and Comments</p>)}
                    {flightClicked && (
                        <div>
                            <button onClick={seeCustomers}>See Customers</button>
                            <button onClick={seeRatingsComments}>See Ratings/Comments</button>
                            {displayCustomers && (
                                <div>
                                <p>Customers:</p>
                                <ul>
                                    {customers.map((item, index) => (
                                        <li key={index}>
                                        <div>{transformMapValue(item)}</div>
                                        </li>
                                    ))}
                                </ul>
                                <p>{seeCustomersStatus}</p>
                            </div>
                            )}

                            {displayRatingsComments && (
                                <div>
                                    <p>Average Rating for this flight {averageRating}</p>

                                    <h3>List of Reviews:</h3>
                                    <p>{ratingsCommentsStatus}</p>
                                    {ratingsComments && (<DisplayMap mapToDisplay ={ratingsComments} clickable={false}></DisplayMap>)}
                                    
                                </div>
                            )}



                        </div>
                    )}
                </div>
            )}
            <h1>Create New Flight</h1>
                 <TextInputBox setState={setFlightNumber} label={"Flight Number:"} />
                 <DateInputBox setState={setDepartureDateTimeNew} label={"Departure Date and Time:"} hasTime={true}/>
                 <TextInputBox setState={setAirlineNameNew} label={"Airline Name:"} />
                 <TextInputBox setState={setAirplaneIDNew} label={"Airplane ID:"} />
                 <DateInputBox setState={setArrivalDateTimeNew} label={"Arrival Date and Time:"} hasTime={true}/>
                 <TextInputBox setState={setBasePriceNew} label={"Base Price:"} />
                 <TextInputBox setState={setArrivesAtNew} label={"Arrives At:"} />
                 <TextInputBox setState={setDepartsFromNew} label={"Departs From:"} />
                 <TextInputBox setState={setFlightStatusNew} label={"Flight Status:"} />
                    <button onClick={handleNewFlight}>Submit New Flight</button>
                    <p>{addFlightStatus}</p>
            </div>
            )}
    </div>
  );
}

export default AirlineStaffHomePage;