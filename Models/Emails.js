const mongoose = require('mongoose');

const Emails = mongoose.Schema;

const userEmails = new Emails({
    email : {type: String, required: true}
},
{
    timestamps : true
}); 

const registrationDetails = mongoose.model('user_emails', userEmails);

module.exports = registrationDetails;