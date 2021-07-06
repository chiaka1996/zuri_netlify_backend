const mongoose = require('mongoose');

const Registration = mongoose.Schema;

const registration = new Registration({
    email : {type: String, required: true},
    password : {type: String, required: true },
    planType: {type: String, required: true}  
},
{
    timestamps : true
}); 

const registrationDetails = mongoose.model('registration', registration);

module.exports = registrationDetails;