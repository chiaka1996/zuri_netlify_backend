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
                message: "server error, check network connection"            })
    }
}

//signup user
exports.sigunUpUsers = async (req, res) => {
    const errorArray = [];
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;
    const nameRegex = /^[a-z]+/gi;
    const numberRegex = /^[0-9]+/gi;
    const {email, password, planType, card} = req.body;
    const {firstName, lastName, cardNumber, expirationDate, ccv} = card;

    try {

    if(!email||!password||!planType||!firstName||
        !lastName||!cardNumber||!expirationDate||!ccv)
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
    
    if(firstName.length < 2 || lastName.length < 2 || !nameRegex.test(lastName)){
         errorArray.push('name should be more than two alphabets');
    }
    if(cardNumber.length !== 16 || !numberRegex.test(cardNumber)){
        errorArray.push('card number should be 16 numbers')
    }
    if(ccv.length !== 3){
        errorArray.push('cvv should be 3 numbers')
    }
    if(errorArray.length > 0) {
        return res.status(400)
            .json({
                statusCode: 400,
                message: [...errorArray]
            })
    }

    const existingEmail = await userDetails.findOne({email});

    if(existingEmail)
        return res.status(400)
        .json({
            statusCode: 400,
            message: "email already in use by another user"
        })

    bcyrpt.hash(password, 10).then(
        (hash) => {

            const userSignup = userDetails.create({
                email,
                planType,
                password: hash,
                card: {
                firstName, 
                lastName,
                cardNumber,
                expirationDate, 
                ccv 
            }
            })

        const token = jwt.sign({ 
            userId: userSignup._id,
            email
            },
        'RANDOM_TOKEN-SECRET_NUMBER',
        { expiresIn: '24h' }
             );

        res.status(201).json({
            // password: encryptedPassword
            payload: {
                email,
                planType,
                card: {
                    firstName,
                    lastName,
                    cardNumber,
                    expirationDate,
                    ccv
                },
                token
            },
            message: "user saved"
                })      
            })        
    }
    catch(err){
        return res.status(500)
        .json({
            err
        })

    }

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
            message: "please fill all fields"
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
            
            bcyrpt.compare(password, user.password)
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
                          user,
                          token
                      })
                }
            ).catch((err) => res.status(500)
            .json({
                statusCode: 500,
                message: err
            })
     )

         }

     ).catch((err) => res.status(500)
            .json({
                statusCode: 500,
                message: err
            })
     )
    
}


//else, proceed to signup user
    //hash the password
    // bcyrpt.hash(password, 10).then(
    //     (hash) => {
    //         const userSignup = new userDetails({
    //             email,
    //             password: hash,
    //             planType,
    //             card: {
    //                 firstName, 
    //                 lastName,
    //                  cardNumber,
    //                 expirationDate, 
    //                 ccv 
    //             }
    //         })
        
    //     userSignup.save()
    //     .then(() => {
            // const token = jwt.sign(
            //     { userId: user._id },
            //     'RANDOM_TOKEN-SECRET_NUMBER',
            //     { expiresIn: '48h' }
            //   );
            
            //   res.status(201).json({
//                   statusCode: 201,
//                   message: "user signedup successfully",
//                   payload: {
//                     email,
//                     planType,
//                     card: {
//                         firstName, 
//                         lastName,
//                         cardNumber,
//                         expirationDate, 
//                         ccv 
//                   }
//                 }
                  
//               })
        
//         }).catch((err) => res.status(500)
//         .json({
//             statusCode: 500,
//             message: 'server error',
//             payload: err
//         }))
//         }
//     ).catch((err) => res.status(500)
//     .json({
//         statusCode: 500,
//         message: 'server error',
//         payload: err
//     }))
// }


// bcyrpt.genSalt(10, (err, salt) => {
        //     if(err)
        // return res.status(500)
        // .json({err})

        // bcyrpt.hash(password, salt, (err, hash) => {
        //     if(err)
        //     return res.status(500)
        //     .json({err}) 

        //     userSignup.password = hash;
        // })
        // })

        // await userSignup.save();

        // const user = await userDetails.findOne({email})

         //     const token = jwt.sign(
    //         { 
    //             userId: user._id,
    //             email: user.email
    //          },
    //         'RANDOM_TOKEN-SECRET_NUMBER',
    //         { expiresIn: '24h' }
    //       );

    //       res.status(201).json({
    //         statusCode: 201,
    //         message: "user sign up successfull",
    //         email,
    //         planType,
    //         card: {
    //             firstName, 
    //             lastName,
    //             cardNumber,
    //             expirationDate, 
    //             ccv 
    //      },
    //      token
        
    //   })

    // userDetails.findOne({email}, (err, existingEmail)=>{
    //     if(err)
    //         return res.status(500)
    //         .json({err})

    //     if(existingEmail)
    //     return res.status(400)
    //     .json({
    //         statusCode: 400,
    //         message: "email already in use by another user"
    //     })

    //     userDetails.create({
    //         email,
    //         planType,
    //         card: {
    //             firstName, 
    //             lastName,
    //             cardNumber,
    //             expirationDate, 
    //             ccv 
    //         }
    //     }, (err, newUser) => {
    //         if(err)
    //         return res.status(500)
    //         .json({err})

    //         bcyrpt.genSalt(10, (err, salt) => {
    //             if(err)
    //         return res.status(500)
    //         .json({err})


    //         })
    //     })

    // })