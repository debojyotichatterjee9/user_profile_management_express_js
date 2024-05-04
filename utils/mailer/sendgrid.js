const config = require('config');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

exports.transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: config.get("mailer").sendgrid.api_key
    }
}));