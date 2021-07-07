const bcyrpt = require('bcrypt');

const jwt = require('jsonwebtoken');

const userDetails = require('../Models/RegistrationDetails');

//check if email already exists
exports.checkEmail = async (req, res) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;
    const {email} = req.body;

    try{

        if(!emailRegex.test(email))
         return res.status(400)
            .json({
                statusCode: 400,
                message: 'please, input a valid email'
            })

    //else...
    const emailCheck = await userDetails.findOne({email});
    if(emailCheck)
        return res.status(400)
            .json({
                statusCode: 400,
                message: 'email already in use by another user'
            })

    //if email does not exist, user can continue with registration
    if(!emailCheck)
        return res.status(200)
        .json({
            statusCode: 200,
            message: "user can continue with registration"
        })

    }
    catch(err){
        return res.status(500)
            .json({
                statusCode: 500,
                message: "server error, check network connection",
                payload: err
            })
    }
}

//signup user
exports.sigunUpUsers = (req, res) => {
    const errorArray = [];
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;
    const nameRegex = /^[a-z]+/gi;
    const numberRegex = /^[0-9]+/gi;
    const {email, password, planType, card} = req.body;
    const {firstName, lastName, cardNumber, expirationDate, cvv} = card;

    if(!email||!password||!planType||!firstName||
        !lastName||cardNumber||expirationDate||!cvv)
        return res.status(400)
        .json({
            statusCode: 400,
            message: "please fill all fields"
        })

    if(!emailRegex.test(email)){
        errorArray.push('invalid email')
    }
    if(password.length < 7) {
        errorArray.push('password should be 7 or more charaters')
    }
    if(firstName < 2 || lastName < 2 || !nameRegex.test(firstName) || !lastName.test(lastName)){
       
         errorArray.push('name should be more than two alphabets');
    }
    if(cardNumber !== 16 || !numberRegex(cardNumber)){
        errorArray.push('card number should be 16 numbers')
    }
    if(cvv !== 3 || !numberRegex(cvv)){
        errorArray.push('cvv should be 3 numbers')
    }
    if(errorArray.length > 0) {
        return res.status(400)
            .json({
                statusCode: 400,
                message: [...errorArray]
            })
    }

    //else, proceed to signup user
    //hash the password
    bcyrpt.hash(password, 10).then(
        (hash) => {
            const userSignup = new userDetails({
                email,
                password: hash,
                planType,
                card: {
                    firstName, 
                    lastName,
                     cardNumber,
                    expirationDate, 
                    cvv 
                }
            })
        
        userSignup.save()
        .then(() => {
            const token = jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN-SECRET_NUMBER',
                { expiresIn: '48h' }
              );
           userDetails.findOne({email})
           .then(
               (user) => {
                res.status(200)
                .json({
                    statusCode: 200,
                    message: 'user signed up successfully',
                    payload: user,
                    token
                })
               }
           ).catch((err) => res.status(500)
            .json({
                statusCode: 500,
                message: 'server error',
                payload: err
            }))
        
        }).catch((err) => res.status(500)
        .json({
            statusCode: 500,
            message: 'server error',
            payload: err
        }))
        }
    ).catch((err) => res.status(500)
    .json({
        statusCode: 500,
        message: 'server error',
        payload: err
    }))
}

//Login users
exports.loginUser = (req, res) => {
    const {email, password} = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;
    const errorArray = [];

    if(!email || !password)
     return res.status(400)
        .json({
            statusCode: 400,
            message: "please fill all fiels"
        })

    if(!emailRegex.test(email)){
        errorArray.push('invalid email address')
    }

    if(password.length < 7){
        errorArray.push('password should be 7 or more characters')
    }

    if(errorArray.length > 0)
     return res.status(400)
        .json({
            statusCode: 400,
            message: [...errorArray]
        })

    //check if the email exist in the database
     userDetails.findOne({email})
     .then(
         (user) => {
            if(!user)
                return res.status(400)
                    .json({
                        statusCode: 400,
                        message: "incorrect email or password"
                    })
            
            bcyrpt.compare(password, user.pasword)
            .then(
                (valid) => {
                    if(!valid)
                      return res.status(400)
                        .json({
                            statusCode: 400,
                            message: "incorrect email or password"
                        })

                    //else, create token and login user.
                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN-SECRET_NUMBER',
                        { expiresIn: '24h' }
                      );

                      res.status(201).json({
                          statusCode: 201,
                          message: "login successfull",
                          user
                      })
                }
            ).catch((err) => res.status(500)
            .json({
                statusCode: 500,
                message: "server error",
                payload: err
            })
     )

         }

     ).catch((err) => res.status(500)
            .json({
                statusCode: 500,
                message: "server error",
                payload: err
            })
     )
    
}