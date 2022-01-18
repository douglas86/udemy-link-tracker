import AWS from 'aws-sdk';

require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

const ses = new AWS.SES({
    apiVersion: '2010-12-01',
});

export const register = (req, res) => {
    // console.log('REGISTER CONTROLLER', req.body);
    const { name, email, password } = req.body;
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email],
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html><body><h1 style="color: red;">Hello ${name}</h1><p>Test email</p></body></html>`,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your registration',
            },
        },
    };
    const sendEmailOnRegister = ses.sendEmail(params).promise();
    sendEmailOnRegister
        .then((data) => {
            console.log('email submitted to SES', data);
            res.send('Email sent');
        })
        .catch((err) => {
            console.log('ses email on register', err);
            res.send('email failed');
        });
};
