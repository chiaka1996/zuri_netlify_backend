zuri netlify backend

file structure

src

|---controllers

    |--UserAuth.js
|

|---models

    |--RegistrationDetails.js
|

|--routes.js

|

|--server.js

API REFERENCES

REGISTRATION API

post api: https://zuri-netlify-backend.herokuapp.com/apis/register

parameter: email, password

example of expected payload: {
    "email":"chikajunior@gmail.com",
	"password": "1234567"
}

on successfull post request: {
    "statusCode": 201,
    
  "message": "user signedup successfully",
  
  "payload": {
  
    "email": "chikajunior@gmail.com",
   
   token
    }
  }
}


EMAIL CHECK API

post api: https://zuri-netlify-backend.herokuapp.com/apis/checkemail

parameter: email

example of expected payload: {

    email: chiakajunior@gmail.com
    
}

on successful post request: {

   "statusCode": 200,
   
  "message": "user can continue with registration"  
  
}

unsuccessful post request: {

     "statusCode": 400,
     
    "message": "email already in use by another user"
    
}


LOGIN API

post api: https://zuri-netlify-backend.herokuapp.com/apis/login

parameter: email, password

example of expected payload: {

    email: chiakajunio@yahoo.com,
    
    password: ************
    
}

successful post request: {

     "statusCode": 201,
     
  "message": "login successfull",
  
  "user": {
  
    "_id": "60e5e4ebeb90032f785a7b74",
    
    "email": "chikajunior@gmail.com",
    
    "password": "$2b$10$pcnpXqDGGNN6cIhrODWaDeSqHhzmqMLhZAng9HramJo1DWUAHx17S",
    
    "planType": "basic",
    
    "card": {
    
      "firstName": "osuji",
      
      "lastName": "Chiaka",
      
      "cardNumber": "1234567890123456",
      
      "expirationDate": "2/21",
      
      "ccv": "551"
    },
    
    "createdAt": "2021-07-07T17:31:23.434Z",
    
    "updatedAt": "2021-07-07T17:31:23.434Z",
    
    "__v": 0
    
  },
  
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGU1ZTRlYmViOTAwMzJmNzg1YTdiNzQiLCJpYXQiOjE2MjU2ODE3MDcsImV4cCI6MTYyNTc2ODEwN30.47-PglP21cj1XZ9e2xIHa3tywLQ9aDupw2gn4AaELo4"
  
}

example of unsuccessfull post request: {

    "statusCode": 400,
    
  "message": "incorrect email or password"
  
}



