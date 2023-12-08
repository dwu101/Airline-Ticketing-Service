from flask import request, Flask, jsonify, session
import sys
sys.path.insert(0,"/python310\lib\site-packages")
import pymysql 
from datetime import datetime, timedelta
import random
import hashlib

app = Flask(__name__)
app.secret_key = 'root'

#COOKIE STRUCTURE:
#[username, password, loginType]

def isCustomer():
    query = '''
    SELECT *
    FROM customer
    WHERE Email_address = %s 
    '''
    data = executeQuery(query, (session['username']), onlyOne=True)

    if data:
        return True 
    return False

def isStaff():
    query = '''
    SELECT *
    FROM airline_staff
    WHERE Username = %s 
    '''
    data = executeQuery(query, (session['username']), onlyOne=True)

    if data:
        return True 
    return False


def priceIncrease(flightNum, airline, departure):
    query = '''
    SELECT Seat_Count
    FROM airplane 
    WHERE Airplane_ID IN(
        SELECT Airplane_ID 
        FROM flight 
        WHERE Flight_Number = %s AND Airline_Name = %s AND Departure_Date_Time = %s  
    )
    '''
        # print(flightNum, airline, departure)
    seatCap = executeQuery(query, (flightNum, airline, departure))[0]['Seat_Count']
    # print("XAS")
    query = '''
SELECT COUNT(Flight_Number) as seatsFilled
FROM Ticket
WHERE Flight_Number = %s AND Departure_Date_Time = %s AND EXISTS (
    SELECT *
    FROM Flight
    WHERE Flight_Number = %s AND Airline_Name = %s AND Departure_Date_Time = %s
    );
    '''
    seatsFilled = executeQuery(query,(flightNum, departure,flightNum, airline, departure))[0]["seatsFilled"]

    # print("HERE")
    ret = {}

    if seatsFilled / seatCap >= 0.8:
        ret["Increase"]= True
    else:
        ret["Increase"]= False

    if seatsFilled == seatCap:
        ret['Full'] = True 
    else: 
        ret['Full'] = False 

    return ret

conn = pymysql.connect(
    host='127.0.0.1',
    port=3307,  
    user='root',
    password='',
    db='project',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

def executeQuery(query, parameters, doCommit = False, onlyOne = False):
    cursor = conn.cursor()
    if parameters:
        cursor.execute(query, parameters) 
    else:
        cursor.execute(query)

    if doCommit:
        conn.commit()

    if onlyOne:
        data = cursor.fetchone()
    else:
        data = cursor.fetchall()

    cursor.close()
    print(data)
    return data

    
@app.route('/logout', methods = ["POST"])
def logout():
    session.clear()
    return 'logged out',200

@app.route('/LoginAuth', methods = ["POST"])
def loginAuth():
    data = request.get_json()
    username = data['Username']
    password = data['Password']
    password = hashlib.md5(password.encode('utf-8')).hexdigest()

    loginType = data['LoginType']

    if loginType == "Customer":
        query = 'SELECT * FROM customer WHERE Email_address = %s AND Customer_Pass = %s'
    else:
        query = 'SELECT * FROM airline_staff WHERE Username = %s AND Airline_Pass = %s'

    data = executeQuery(query, (username,password), onlyOne=True)

    if data:
        session['username'] = username
        session['password'] = password
        session['loginType'] = loginType
        

        if loginType == "Airline Staff":
            query = '''SELECT Airline_Name FROM airline_staff WHERE Username = %s'''
            data = executeQuery(query, (username))
            session['airlineName'] = data[0]['Airline_Name']

        return 'User exists', 201
    else:
       print("y")
       return 'Username or password incorrect', 400
    
@app.route('/FlightSearch', methods = ["POST"])
def FlightSearch():

    ret = {}
    data = request.get_json()
    departAirport = data['DepartAirport']
    arriveAirport = data['ArriveAirport']
    departDate = data['DepartDate']
    returnDate = data['ReturnDate']
    tripType = data['TripType']
    
    cursor = conn.cursor()
    departDate += "%"
    returnDate += "%"
    
         
    query = """
SELECT 
    Flight.Flight_Number, Flight.Departure_Date_Time, Flight.Arrival_Date_Time, Flight.Airline_Name,
    Flight.Airplane_ID, Flight.Base_Price, Flight.Arrives_at AS Arrival_Airport_Name, Flight.Departs_from 
    AS Departure_Airport_Name, DepartureAirport.City as Departure_City, ArrivalAirport.City as Arrival_City
FROM 
    Flight, Airport AS DepartureAirport, Airport AS ArrivalAirport
WHERE 
    Flight.Departs_from = DepartureAirport.Code AND Flight.Arrives_at = ArrivalAirport.Code AND 
    DepartureAirport.Airport_Name = %s AND ArrivalAirport.Airport_Name = %s AND 
    (DepartureAirport.City = %s OR DepartureAirport.Airport_Name = %s) AND 
    (ArrivalAirport.City = %s OR ArrivalAirport.Airport_Name = %s) AND 
    Departure_Date_Time LIKE %s
"""

    data = executeQuery(query, (departAirport, arriveAirport,departAirport, departAirport, arriveAirport, arriveAirport,departDate))
    for i in range(len(data)):
        # print("DATA", data[i])
        temp = priceIncrease(data[i]['Flight_Number'], data[i]['Airline_Name'], data[i]['Departure_Date_Time'])
        if temp['Full']:
            data.pop(i)

        if temp['Increase']:
            data[i]['Real_Price'] =1.25*data[i]['Base_Price']
        else:
            data[i]['Real_Price'] = data[i]['Base_Price'] 
        
        del data[i]['Base_Price']


    ret['Way1'] = data

    if tripType == "Round-Trip":
        data = executeQuery(query, (arriveAirport, departAirport,arriveAirport, arriveAirport, departAirport, departAirport,returnDate))
        for i in range(len(data)):
            
            temp = priceIncrease(data[i]['Flight_Number'], data[i]['Airline_Name'], data[i]['Departure_Date_Time'])
            if temp['Full']:
                data.pop(i)
            if temp['Increase']:
                data[i]['Real_Price'] =1.25*data[i]['Base_Price']
            else:
                data[i]['Real_Price'] = data[i]['Base_Price']
        del data[i]['Base_Price']

        ret['Way2'] = data #HOW TO ACCOUNT FOR THAT IT HAS TO LEAVE AFTER THE LAST PLANE ARRIVES

#flightNum, airline, departure

    if data:
        return ret
    else:
       print("y")
       response = jsonify({
        'message': 'No Flights Availalbe'
       })
       response.status_code = 400
       return response

@app.route('/getAirports', methods = ["GET"])
def getAirports():

    ret = []

    query = "SELECT DISTINCT Airport_Name FROM airport"
    ret += executeQuery(query, None)

    query = "SELECT DISTINCT City FROM airport"
    ret += executeQuery(query, None)

    print(ret)
    return {'Airports': ret}


@app.route('/StatusSearch', methods = ["POST"])
def StatusSearch():
    #airline name, flight number, depart date

    ret = {}
    data = request.get_json()
    airlineName = data['AirlineName']
    flightNum = data['FlightNum']
    departDate = data['DepartDate']
    
    cursor = conn.cursor()
    departDate += "%"

    query = '''
    SELECT Flight_status 
    FROM flight
    WHERE Airline_Name = %s AND Flight_Number = %s AND Departure_Date_Time LIKE %s
    '''
    data = executeQuery(query, (airlineName, flightNum, departDate))

    print(data)
    if data:
        return data[0]
    else:
       print("y")
       response = jsonify({
        'message': 'No Flights Available'
       })
       response.status_code = 400
       return response
    

@app.route('/CustomerRegister', methods = ["POST"])
def CustomerRegister(): 
    data = request.get_json() 
    email = data['emailAddress']

    query = '''
SELECT * 
FROM customer
WHERE Email_address = %s;
'''
    userExists = executeQuery(query, (email))
    print(userExists)

    if userExists:
        return 'User Already Exists. Please login instead', 400 
    else:
        firstName = data["firstName"]
        lastName = data["lastName"]
        password= data["password"]
        password = hashlib.md5(password.encode('utf-8')).hexdigest()
        DOB = data["DOB"]
        buildingNumber= data["buildingNumber"]
        streetName = data["streetName"]
        apartmentNumber= data["apartmentNumber"]
        city= data["city"]
        state = data["state"]
        zipCode = data["zipCode"]
        passportNumber= data["passportNumber"]
        passportExpiration= data["passportExpiration"]
        passportCountry= data["passportCountry"]
        phoneNum = data["phoneNum"]
        query = '''
INSERT INTO customer VALUES (%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
'''
        executeQuery(query, (email, firstName, lastName, password, buildingNumber, streetName, apartmentNumber, city, state, zipCode, passportNumber, passportExpiration, passportCountry, DOB), True)
        
        query = '''
INSERT INTO customer_phone_numbers VALUES (%s, %s)
'''
        executeQuery(query, (email, phoneNum), True)

        return 'Registered', 200 

@app.route('/AirlineStaffRegister', methods = ["POST"])
def AirlineStaffRegister(): 
    data = request.get_json() 
    username = data['username']

    query = '''
SELECT * 
FROM airline_staff
WHERE Username = %s;
'''
    userExists = executeQuery(query, (username))

    if userExists:
        return 'User Already Exists. Please login instead', 400 
    else:
        firstName = data["firstName"]
        lastName = data["lastName"]
        password= data["password"]
        password = hashlib.md5(password.encode('utf-8')).hexdigest()

        DOB = data["DOB"]
        airlineName = data["airlineName"]
        phoneNum = data["phoneNum"]
        email = data["emailAddress"]
        query = '''
INSERT INTO airline_staff VALUES (%s,%s, %s, %s, %s, %s)
'''

        executeQuery(query, (username, airlineName, password, firstName, lastName, DOB), True)

        query = '''
INSERT INTO airline_staff_emails VALUES (%s, %s)
'''
        executeQuery(query, (username, email), True)

        query = '''
INSERT INTO airline_staff_phone_numbers VALUES (%s, %s)
'''
        executeQuery(query, (username, phoneNum), True)
        return 'Registered', 200 

@app.route('/addEmail', methods = ["POST"])
def addEmail():
    try:
        if not isStaff():
            return 'Not Authorized', 600
        data = request.get_json() 
        email = data['email']


        query = '''
SELECT * 
FROM airline_staff_emails
WHERE Username = %s AND Email_Address = %s
'''
        response = executeQuery(query, (session['username'], email))
        if response:
            return 'Phone Number Already Exists', 700
        
        query = '''
INSERT INTO airline_staff_emails VALUES (%s, %s)
    '''
        executeQuery(query, (session['username'], email), True)
        return 'done', 200   
    except Exception as e:
        print(e)
        return 'error', 400 

@app.route('/addPhoneAS', methods = ["POST"])
def addPhoneAS():
    try:
        if not isStaff():
            return 'Not Authorized', 600
        data = request.get_json() 
        phoneNum = data['phoneNum']
#CHECK FOR ITS EXISTENCE
        query = '''
SELECT * 
FROM airline_staff_phone_numbers
WHERE Username = %s AND Phone_Number = %s
'''
        response = executeQuery(query, (session['username'], phoneNum))
        if response:
            return 'Phone Number Already Exists', 700
        query = '''
INSERT INTO airline_staff_phone_numbers VALUES (%s, %s)
    '''
        executeQuery(query, (session['username'], phoneNum), True)
        return 'done', 200   
    except Exception as e:
        print(e)
        return 'error', 400 
    
@app.route('/addPhoneCust', methods = ["POST"])
def addPhoneCust():
    try:
        if not isCustomer():
            return 'Not Authorized', 600
    
        data = request.get_json() 
        phoneNum = data['Phone_Number']

        query = '''
SELECT * 
FROM customer_phone_numbers
WHERE Email_address = %s AND Phone_Number = %s
'''
        response = executeQuery(query, (session['username'], phoneNum))
        if response:
            return 'Phone Number Already Exists', 700
        
        query = '''
INSERT INTO customer_phone_numbers VALUES (%s, %s)
    '''
        executeQuery(query, (session['username'], phoneNum), True)
        return 'done', 200   
    except Exception as e:
        print(e)
        return 'error', 400 


@app.route('/getUserType', methods = ["GET"])
def getUserType():
    if "loginType" in session:
        data = {'userType' : session['loginType']} 
    else:
        data = {'userType' : ""} 

    if data:
        return jsonify(data)
    else:
        return "ERROR", 400

@app.route('/increaseTicketPrice', methods = ["POST"])
def increaseTicketPrice():
    if not isCustomer():
        return 'Not Authorized', 600
    try:
        # print("ASDAG")
        data = request.get_json() 
        # print(data)
        flightNum = data['flightNum']
        airline = data['airline']
        departure = data['departure']
    # Flight_Number = 163 AND Airline_Name = "Jet Blue" AND Departure_Date_Time = "2023-11-08 12:15:30"
        query = '''
    SELECT Seat_Count
    FROM airplane 
    WHERE Airplane_ID IN(
        SELECT Airplane_ID 
        FROM flight 
        WHERE Flight_Number = %s AND Airline_Name = %s AND Departure_Date_Time = %s  
    )
    '''
        # print(flightNum, airline, departure)
        seatCap = executeQuery(query, (flightNum, airline, departure))[0]['Seat_Count']
        # print("XAS")
        query = '''
    SELECT COUNT(Flight_Number) as seatsFilled
    FROM Ticket
    WHERE Flight_Number = %s AND Departure_Date_Time = %s AND EXISTS (
        SELECT *
        FROM Flight
        WHERE Flight_Number = %s AND Airline_Name = %s AND Departure_Date_Time = %s
    );
    '''
        seatsFilled = executeQuery(query,(flightNum, departure,flightNum, airline, departure))[0]["seatsFilled"]

        # print("HERE")
        print(seatsFilled, seatCap)
        ret = {}

        if seatsFilled / seatCap >= 0.8:
            ret["Increase"]= True
        else:
            ret["Increase"]= False

        if seatsFilled == seatCap:
            ret['Full'] = True 
        else: 
            ret['Full'] = False 

        return ret
    except Exception as e:
        print(e)
        return {"ERROR": 400}

@app.route('/buyTicket', methods = ["POST"])
def buyTicket():
    if not isCustomer():
        return 'Not Authorized', 600
    try:
        data = request.get_json() 
        ticketID = random.randint(10000,99999)
        email = session['username']
        flightNum1 = data['flightNum']
        departure = data['departure']
        price = data['price']
        cardType = data['cardType']
        cardNumber = data['cardNumber']
        cardName = data['cardName']
        cardExp = data['cardExp']
        firstName = data['firstName']
        lastName = data['lastName']
        DOB = data['DOB']
        full = data['full']

        if full:
            return '{x} is Full'.format(flightNum1), 405

        
        query = '''
    SELECT *
    FROM ticket
    WHERE Ticket_ID = %s
    '''
        response = executeQuery(query, (ticketID))

        print("a")
        while response: #need a ticketID that is NOT in the db already
            ticketID = random.randint(10000,99999)
            response = executeQuery(query, (ticketID)) 
        
        currTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print("b")
        query = '''
    INSERT INTO Ticket 
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
    '''

        executeQuery(query, (ticketID, email, flightNum1, departure, price, cardType, cardNumber, cardName, cardExp, currTime), True)
        
        query = '''
INSERT INTO buys 
VALUES (%s, %s, %s,%s ,%s);
'''
        print((email, ticketID, firstName, lastName, DOB))
        executeQuery(query, (email, ticketID, firstName, lastName, DOB), True)
        
        return 'Bought', 200 
    
    except Exception as e:
        print(e)
        return 'ERROR', 400 




@app.route('/getFlights', methods = ["GET"])
def getFlights():
    if not isCustomer():
        return 'Not Authorized', 600
    curr = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    query = '''
SELECT ticket.Ticket_ID, flight.Departure_Date_Time, Arrival_Date_time, flight.Flight_Number, Airline_Name, Arrives_at, Departs_from, Flight_Status, buys.First_Name, buys.Last_Name
FROM ticket, flight, buys
WHERE ticket.Flight_Number = flight.Flight_Number AND flight.Departure_Date_Time = ticket.Departure_Date_Time AND ticket.Email_Address = %s AND buys.Email_Address = ticket.Email_address AND ticket.Ticket_ID = buys.Ticket_ID AND ticket.Departure_Date_Time > %s
'''
    print(session['username'])
    data = executeQuery(query, (session['username'], curr))
    print(data)
    return jsonify(data)

@app.route('/getSpending', methods = ["POST"])
def getSpending():
    if not isCustomer():
        return 'Not Authorized', 600
    data = request.get_json()
    start = data['start']
    end = data['end']

    if start == "" and end == "" : #default, do a year before 
        yearAgo = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d') + " 00:00:00" 
        query = '''
SELECT SUM(Ticket_Price) as Spending
FROM ticket 
WHERE Email_address = %s AND Purchase_Date_Time > %s;
'''
        response = executeQuery(query, (session['username'], yearAgo))
        ret = {"Spending": response[0]['Spending']}
        last6Months = [
            datetime.now().strftime('%Y-%m-%d') + " 00:00:00" ,
            (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d') + " 00:00:00" ,
            (datetime.now() - timedelta(days=60)).strftime('%Y-%m-%d') + " 00:00:00" ,
            (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d') + " 00:00:00" ,
            (datetime.now() - timedelta(days=120)).strftime('%Y-%m-%d') + " 00:00:00" ,
            (datetime.now() - timedelta(days=150)).strftime('%Y-%m-%d') + " 00:00:00" ,
            (datetime.now() - timedelta(days=180)).strftime('%Y-%m-%d') + " 00:00:00" ,
            (datetime.now() - timedelta(days=210)).strftime('%Y-%m-%d') + " 00:00:00"
        ]
        for i in range(1,len(last6Months)):
            start = last6Months[i]
            startDay = start[:10]
            end = last6Months[i-1]
            endDay = end[:10]
            currRange = startDay + " - " + endDay
            query = '''
SELECT SUM(Ticket_Price) as Spending
FROM ticket
WHERE Purchase_Date_Time > %s AND Purchase_Date_Time <= %s AND Email_Address = %s
'''
            data = executeQuery(query, (start, end, session['username'])) 
            if data[0]['Spending'] == None:
                ret[currRange] = 0
            else:
                ret[currRange] = data[0]['Spending'] 
        

        return jsonify(ret)
    

    else: 

        query = '''
SELECT SUM(Ticket_Price) as Spending
FROM ticket 
WHERE Email_address = %s AND Purchase_Date_Time >= %s AND Purchase_Date_time <= %s ;
'''
        response = executeQuery(query, (session['username'], start, end))
        print("HERE", response)
        ret = {"Spending": response[0]['Spending']}

        monthsToDisplay = []
        curr = end 
        while True:
            if datetime.strptime(curr,'%Y-%m-%d') < datetime.strptime(start,'%Y-%m-%d'):
                #just add the end to the list
                monthsToDisplay.append(start + " 00:00:00")
                break 
            else:
                monthsToDisplay.append(curr + " 00:00:00")
                curr = (datetime.strptime(curr,'%Y-%m-%d') - timedelta(days=30)).strftime('%Y-%m-%d')

        print(monthsToDisplay)
        for i in range(1,len(monthsToDisplay)):
            print("X")
            start = monthsToDisplay[i]
            startDay = start[:10]
            end = monthsToDisplay[i-1]
            endDay = end[:10]
            currRange = startDay + " - " + endDay
            query = '''
        
SELECT SUM(Ticket_Price) as Spending
FROM ticket
WHERE Purchase_Date_Time > %s AND Purchase_Date_Time <= %s AND Email_Address = %s
'''
            print(start, end)
            data = executeQuery(query, (start, end, session['username'])) 
            print(data)
            if data[0]['Spending'] == None:
                ret[currRange] = 0
            else:
                ret[currRange] = data[0]['Spending'] 
            print(ret)
        
    return jsonify(ret)

@app.route('/cancelFlight', methods = ["POST"])
def cancelFlight():
    if not isCustomer():
        return 'Not Authorized', 600
    data = request.get_json()
    ticketID = data["Ticket_ID"]

    try:

        query = '''
DELETE FROM buys 
WHERE Ticket_ID = %s
'''
        executeQuery(query, (ticketID), True)

        query = '''
DELETE FROM ticket
WHERE Ticket_ID = %s
'''
        executeQuery(query, (ticketID), True)

    
        return 'done', 200
    except Exception as e:
        print(e)
        return 'error', 400

@app.route('/getPastFlights', methods = ["GET"])
def getPastFlights():
    if not isCustomer():
        return 'Not Authorized', 600
    curr = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    query = '''
SELECT ticket.Ticket_ID, flight.Departure_Date_Time, Arrival_Date_time, flight.Flight_Number, Airline_Name, Arrives_at, Departs_from
FROM ticket, flight
WHERE ticket.Flight_Number = flight.Flight_Number AND flight.Departure_Date_Time = ticket.Departure_Date_Time AND ticket.Email_Address = %s AND ticket.Departure_Date_Time <= %s
'''
    data = executeQuery(query, (session['username'], curr))
    # print(data)

    return jsonify(data)
@app.route('/leaveReview', methods = ["POST"])
def leaveReview():
    if not isCustomer():
        return 'Not Authorized', 600
    try:
        data = request.get_json()
        print(data)
        stars = data['stars']
        comment = data['comment']
        flightNum = data['flightNum']
        airlineName = data['airlineName']
        depart = data['depart']

        query = '''
    INSERT INTO reviews 
    VALUES (%s,%s,%s,%s,%s,%s)
    '''
        executeQuery(query, (session['username'], flightNum, depart, airlineName, stars, comment), True)
        return 'done', 200
    except Exception as e:
        print(e)
        return 'error', 400

@app.route('/DefaultFutureFlightsAS', methods = ["GET"])
def DefaultFutureFlightsAS():
    if not isStaff():
        return 'Not Authorized', 600
    curr = datetime.now()
    future = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')


    query = '''
SELECT * 
FROM flight
WHERE Departure_Date_Time >= %s AND Departure_Date_time <= %s AND Airline_Name = %s
'''
    data = executeQuery(query, (curr, future, session['airlineName']))
    return jsonify(data)

@app.route('/CustomFutureFlightsAS', methods = ["POST"])
def CustomFutureFlightsAS():
    if not isStaff():
        return 'Not Authorized', 600
    
    try:
        
        data = request.get_json()
        submitType= data['submitType']
        start = data['start']
        end = data['end']
        source1 = data['source1']
        destination1 = data['destination1']
        source2 = data['source2']
        destination2 = data['destination2']
        flightNum = data['flightNum']
        if submitType == "dateRange":
            query = '''
        SELECT * 
        FROM flight
        WHERE Departure_Date_Time >= %s AND Departure_Date_Time <= %s AND Airline_Name = %s
    '''
            data = executeQuery(query, (start, end, session['airlineName']))

        elif submitType == "sourceSearch":
            query = '''
    SELECT flight.Flight_Number, flight.Departure_Date_Time, flight.Airline_Name, flight.Arrival_Date_Time, flight.Base_Price, flight.Arrives_at, flight.Departs_from, flight.Flight_Status 
    FROM flight , airport as DepartsAirport 
    WHERE flight.Airline_Name = %s AND flight.Departs_from = DepartsAirport.Code AND (DepartsAirport.City = %s OR DepartsAirport.Airport_Name = %s);
            '''
            data = executeQuery(query, (session['airlineName'], source1, source1))

        elif submitType == "destinationSearch":
            query = '''
        SELECT flight.Flight_Number, flight.Departure_Date_Time, flight.Airline_Name, flight.Arrival_Date_Time, flight.Base_Price, flight.Arrives_at, flight.Departs_from, flight.Flight_Status 
        FROM flight , airport as ArrivesAirport 
        WHERE flight.Airline_Name = %s AND flight.Arrives_at = ArrivesAirport.Code AND (ArrivesAirport.City = %s OR ArrivesAirport.Airport_Name = %s);
        ''' 
            data = executeQuery(query, (session['airlineName'], destination1, destination1))

        elif submitType == "sourceDestinationSearch":
            query = '''
    SELECT flight.Flight_Number, flight.Departure_Date_Time, flight.Airline_Name, flight.Arrival_Date_Time, flight.Base_Price, flight.Arrives_at, flight.Departs_from, flight.Flight_Status 
    FROM flight , airport as ArrivesAirport, airport as DepartsAirport
    WHERE flight.Airline_Name = %s AND flight.Departs_from = DepartsAirport.Code AND flight.Arrives_at = ArrivesAirport.Code AND (ArrivesAirport.City = %s OR ArrivesAirport.Airport_Name = %s) AND (DepartsAirport.City = %s OR DepartsAirport.Airport_Name = %s); 
    '''
            data = executeQuery(query, (session['airlineName'],destination2, destination2, source2, source2))

        elif submitType == "flightNumSearch":
            query = '''
    SELECT flight.Flight_Number, flight.Departure_Date_Time, flight.Airline_Name, flight.Arrival_Date_Time, flight.Base_Price, flight.Arrives_at, flight.Departs_from, flight.Flight_Status
    FROM flight 
    WHERE flight.Airline_Name = %s AND flight.Flight_Number = %s
    '''
            data = executeQuery(query, (session['airlineName'],flightNum))
        else:
            return 'ERROR IN submitType', 400
    except Exception as e:
        print(e)
        return 'ERROR', 400

    return jsonify(data) 

@app.route('/seeCustomers', methods = ["POST"])
def seeCustomers():
    if not isStaff():
        return 'Not Authorized', 600

    data = request.get_json()
    flightNum = data['flightNum']
    depart = data['depart']
    query = '''
SELECT Buys.First_Name, Buys.Last_Name
FROM Buys, Ticket, Flight
WHERE
    Buys.Email_Address = Ticket.Email_Address
    AND Ticket.Flight_Number = Flight.Flight_Number
    AND Ticket.Departure_Date_Time = Flight.Departure_Date_Time
    AND Flight.Flight_Number = %s
    AND Flight.Departure_Date_Time = %s
    AND Flight.Airline_Name = %s
    AND Buys.Ticket_ID = Ticket.Ticket_ID;
'''
    data = executeQuery(query, (flightNum, depart, session['airlineName']))
    return jsonify(data)


@app.route('/addFlight', methods = ["POST"])
def addFlight():
    if not isStaff():
        return 'Not Authorized', 600

    data = request.get_json()
    print(data)
    flightNum = data['flightNumber']
    depart = data['departsFrom']
    arrive = data['arrivesAt']
    departTime = data['departureDateTime']
    arriveTime = data['arrivalDateTime']
    price = data['basePrice']
    status = data['status']
    airplaneID = data['airplaneID']
    airlineName = session['airlineName']
    currTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


    query = '''
SELECT * 
FROM owns
WHERE Airline_Name = %s AND Airplane_ID = %s AND Maintenance_Start_Date_Time <= %s AND Maintenance_End_Date_Time >= %s
'''
    response = executeQuery(query, (airlineName, airplaneID, currTime, currTime))
    if response:
        return 'Airplane is in Maintenance', 700 
    

    query = '''
INSERT INTO Flight
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
'''
    executeQuery(query, (flightNum,departTime ,airlineName, airplaneID, arriveTime, price, arrive, depart, status), True)
    return 'done', 200
'''
'flightNumber': flightNumberSC,
                'departureDateTime': DateConverter(departureDateTimeSC, true),
                'status': flightStatusSC
'''

@app.route('/changeFlightStatus', methods = ["POST"])
def changeFlightStatus():
    if not isStaff():
        return 'Not Authorized', 600
    try:
        data = request.get_json()
        flightNum = data['flightNumber']
        depart = data['departureDateTime']
        status = data['status']
        airlineName = session['airlineName']
        query = '''
    UPDATE flight 
    SET Flight_Status = %s
    WHERE Flight_Number = %s AND Departure_Date_Time = %s AND Airline_Name = %s 
    '''
        executeQuery(query, (status, flightNum, depart, airlineName), True)
        return 'done', 200 
    except Exception as e:
        print(e)
        return 'error', 400

@app.route('/addAirplane', methods = ["POST"])
def addPlane():
    if not isStaff():
        return 'Not Authorized', 600
    try:
        data = request.get_json()
        airplaneID = data['airplaneID']
        seatCount = data['seatCount']
        airlineName = session['airlineName']
        manufacturingCompany = data['manufacturingCompany']
        modelNumber = data['modelNumber']
        manufacturingDate = data['manufacturingDate']
        query = '''
    INSERT INTO airplane
    VALUES (%s, %s, %s, %s, %s, %s)
    '''
        executeQuery(query, (airplaneID, airlineName, seatCount,manufacturingCompany,modelNumber,manufacturingDate), True)
        return 'done', 200
    except Exception as e:
        print(e)
        return 'error', 400
    


@app.route('/addAirport', methods = ["POST"])
def addAirport():
    if not isStaff():
        return 'Not Authorized', 600
    try:
        data = request.get_json()
        airportCode = data['airportCode']
        airportName = data['airportName']
        airportCity = data['airportCity']
        airportCountry = data['airportCountry']
        airportNumTerminals = data['airportNumTerminals']
        airportType = data['airportType']
        query = '''
    INSERT INTO airport
    VALUES (%s, %s, %s, %s, %s, %s)
    '''
        executeQuery(query, (airportCode, airportName, airportCity, airportCountry, airportNumTerminals, airportType), True)
        return 'done', 200
    except Exception as e:
        print(e)
        return 'error', 400
    

@app.route('/seeRatingsComments', methods = ["POST"])
def seeRatingsComments():
    if not isStaff():
        return 'Not Authorized', 600 

    data = request.get_json()
    flightNum = data['flightNum']
    depart = data['depart']
    airlineName = session['airlineName']
    query = '''
SELECT AVG(Rating) as avgRating
FROM reviews
WHERE Flight_Number = %s AND Departure_Date_Time = %s AND Airline_Name = %s
'''
    avgRating = executeQuery(query, (flightNum, depart, airlineName))[0]['avgRating']
    query = '''
SELECT Rating, Comment 
FROM reviews
WHERE Flight_Number = %s AND Departure_Date_Time = %s AND Airline_Name = %s
'''
    data = executeQuery(query, (flightNum, depart, airlineName))
    ret = {'avgRating': avgRating, 'ratingsComments': data}
    return jsonify(ret)


@app.route('/schedMaint', methods = ["POST"])
def schedMaint():
    if not isStaff():
        return 'Not Authorized', 600 

    data = request.get_json()
    airplaneID = data['airplaneID']
    startDate = data['startDate']
    endDate = data['endDate']
    airlineName = session['airlineName']
    query = '''
INSERT INTO owns 
VALUES (%s, %s, %s, %s)
    '''
    executeQuery(query, (airlineName, airplaneID, startDate, endDate), True)

    query = '''
UPDATE flight 
SET Flight_Status = %s
WHERE Airplane_ID = %s AND Airline_Name = %s AND Departure_Date_Time >= %s AND Departure_Date_Time <= %s
'''
    executeQuery(query, ("cancelled", airplaneID, airlineName, startDate, endDate), True)

    return 'done', 200 

@app.route('/getRev', methods = ["GET"])
def getRev():
    try:
        if not isStaff():
            return 'Not Authorized', 600 
        currTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        yearAgo = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d') + " 00:00:00"
        monthAgo = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d') + " 00:00:00"
        ret = {}

        query = '''
    SELECT SUM(Ticket_Price) as Revenue
    FROM ticket, flight
    WHERE ticket.Flight_Number = flight.Flight_Number AND ticket.Departure_Date_Time = flight.Departure_Date_Time
    AND flight.Airline_Name = %s AND ticket.Purchase_Date_Time > %s
    '''
        data = executeQuery(query, (session['airlineName'], yearAgo))[0]
        ret['year'] = data['Revenue']


        data = executeQuery(query, (session['airlineName'], monthAgo))[0]
        ret['month'] = data['Revenue']
        return jsonify(ret) 
    except Exception as e:
        print(e)
        return 'error', 400 
    

@app.route('/mostFrequentCustomer', methods = ["GET"])
def mostFrequentCustomer():
    if not isStaff():
        return 'Not Authorized', 600  
    try:
        query = '''
WITH temp(Email_Address, First_Name, Last_Name) as 
    (SELECT C.Email_Address, C.First_Name, C.Last_Name
    FROM Flight F, Ticket T, Customer C
    WHERE F.Airline_Name = %s AND F.Flight_Number = T.Flight_Number AND T.Email_Address = C.Email_Address
    AND T.Purchase_Date_Time >=%s)

SELECT
    Email_Address,
    First_Name,
    Last_Name,
    COUNT(*) AS tickets_bought
FROM
    temp
GROUP BY
    Email_Address
HAVING 
	tickets_bought IN (SELECT MAX(tickets_bought) FROM (
                            SELECT
                            COUNT(*) AS tickets_bought
                            FROM
                            temp
                            GROUP BY
                            Email_Address) as temp2);
'''
        data = executeQuery(query, (session['airlineName'], (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d') + " 00:00:00"))
        return jsonify(data)
    except Exception as e:
        print(e)
        return 'error', 400
 
@app.route('/customerSearch', methods = ["POST"])
def customerSearch():
    if not isStaff():
        return 'Not Authorized', 600 
    try:
        data = request.get_json()
        email = data['email']

        query = '''
    SELECT ticket.Departure_Date_Time, ticket.Flight_Number, flight.Airline_Name
    FROM ticket, flight
    WHERE Email_address = %s AND ticket.Flight_Number = flight.Flight_Number 
    AND ticket.Departure_Date_Time = flight.Departure_Date_Time AND flight.Airline_Name = %s;
    '''
        data = executeQuery(query, (email, session['airlineName']))
        return jsonify(data)
    except Exception as e:
        print(e)
        return 'error', 400
    

@app.route('/monthTicketSales', methods = ["POST"])
def monthTicketSales():
    if not isStaff():
        return 'Not Authorized', 600 
    try:
        data = request.get_json()
        monthYear = data['month']

        year = monthYear[0:4]
        month = monthYear[5:]
        startDate = year + "-" + month + "-01 00:00:00"
        endDate = year + "-" + month + "-31 23:59:59"
        airlineName = session['airlineName']
        query = '''
    SELECT COUNT(*) as numTickets
    FROM ticket, flight
    WHERE ticket.Flight_Number = flight.Flight_Number AND ticket.Departure_Date_Time = flight.Departure_Date_Time
    AND flight.Airline_Name = %s AND ticket.Purchase_Date_Time >= %s AND ticket.Purchase_Date_Time <= %s
'''
        data = executeQuery(query, (airlineName, startDate, endDate))[0]
        print(data)
        return jsonify(data)
    except Exception as e:
        print(e)
        return 'error', 400 

@app.route('/statusTotal', methods = ["POST"])
def statusTotal():
    if not isStaff():
        return 'Not Authorized', 600 
    try:
        data = request.get_json()
        status = data['status']

        airlineName = session['airlineName']
        query = '''
    SELECT COUNT(*) as numTickets
    FROM ticket, flight
    WHERE ticket.Flight_Number = flight.Flight_Number AND ticket.Departure_Date_Time = flight.Departure_Date_Time
    AND flight.Airline_Name = %s AND flight.Flight_Status = %s
'''
        data = executeQuery(query, (airlineName, status))[0]
        ret = {'statusTotal': data['numTickets']}
        return jsonify(ret)
    except Exception as e:
        print(e)
        return 'error', 400
    
    

if __name__ =="__main__":
    app.run('127.0.0.1', 5000, debug =True)


