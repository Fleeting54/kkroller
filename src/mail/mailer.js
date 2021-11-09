
const nodemailer = require('nodemailer')
const mailConstants = require("./mailConstants")

let transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: mailConstants.sender,
        pass: mailConstants.mailPass
    }
});


module.exports = transporter