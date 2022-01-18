import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

import User from '../models/user';

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

    // check if user exists in our db
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            console.log(err);
            return res.status(400).json({
                error: 'Email is taken',
            });
        }
        // generate token with user name email and password
        const token = jwt.sign(
            { name, email, password },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '10m',
            }
        );

        // send email
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
                        Data: `
                        <html>
                            <h1 style="color: red;">Verify your email address</h1>
                            <p>Please use the following link to complete your registration:</p>
                            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                        </html>
                        `,
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
    });
};
