
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: 'FILL ME IN OFFLINE',
        pass: 'FILL ME IN OFFLINE'
    }
});


module.exports = transporter