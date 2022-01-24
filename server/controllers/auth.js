import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import { registerEmailParams } from '../helpers/email';

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
        const params = registerEmailParams(email, token);

        const sendEmailOnRegister = ses.sendEmail(params).promise();
        sendEmailOnRegister
            .then((data) => {
                console.log('email submitted to SES', data);
                res.json({
                    message: `Email has been sent to ${email}, Follow the instruction to complete your registration`,
                });
            })
            .catch((err) => {
                console.log('ses email on register', err);
                res.json({
                    message: `We could not verify your email, Please try again`,
                });
            });
    });
};

export const registerActivated = (req, res) => {
    const { token } = req.body;
    console.log('body', req);
    console.log('token', token);
};
