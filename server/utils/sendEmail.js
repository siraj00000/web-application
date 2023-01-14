// const nodemailer = require("nodemailer");
// const nodemailMailgun = require('nodemailer-mailgun-transport');

const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const sendEmail = async (option) => {
    try {
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'abhishek.jaiswal.doon@gmail.com',
            name: 'Labelmaker',
        };
        const receivers = [{ email: option.to }];

        const tranEmail = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: option.subject,
            htmlContent: option.text,
            params: {
                role: 'Frontend',
            },
        });
        if (tranEmail)
            console.log('email has been sent');
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;