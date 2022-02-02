import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import shortId from 'shortid';
import {
    registerEmailParams,
    forgetPasswordEmailParams,
} from '../helpers/email';

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
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                error: 'Expired link. Try again',
            });
        }
        const { name, email, password } = jwt.decode(token);
        const username = shortId.generate();

        User.findOne({ email }).exec((err, user) => {
            if (user) {
                return res.status(401).json({
                    error: 'Email is taken',
                });
            }
            // register new user
            const newUser = new User({ username, name, email, password });
            newUser.save((err, user) => {
                if (err) {
                    return res.status(401).json({
                        error: 'Error saving user in database, try later.',
                    });
                }
                return res.json({
                    message: 'Registration success. Please login.',
                });
            });
        });
    });
};

export const login = (req, res) => {
    const { email, password } = req.body;
    // console.table({ email, password });
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please register.',
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match',
            });
        }

        // generate token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role },
        });
    });
};

// req.user
export const requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
});

export const authMiddleWare = (req, res, next) => {
    const authUserId = req.user._id;
    User.findOne({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found',
            });
        }
        req.profile = user;
        next();
    });
};

export const adminMiddleWare = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findOne({ _id: adminUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found',
            });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource, Access denied',
            });
        }

        req.profile = user;
        next();
    });
};

export const forgetPassword = (req, res) => {
    const { email } = req.body;
    // check fi user exists with that email
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist',
            });
        }
        // generate token and email to user
        const token = jwt.sign(
            { name: user.name },
            process.env.JWT_RESET_PASSWORD,
            { expiresIn: '10m' }
        );

        // send email
        const params = forgetPasswordEmailParams(email, token);

        // populate the db > user > resetPasswordLink
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.status(400).json({
                    error: 'Password reset failed. Try later.',
                });
            }
            const sendEmail = ses.sendEmail(params).promise();
            sendEmail
                .then((data) => {
                    console.log('ses reset password success', data);
                    return res.json({
                        message: `Email has been sent to ${email}. Click on the link to reset your password`,
                    });
                })
                .catch((err) => {
                    console.log('ses reset password failed', err);
                    return res.json({
                        message: `We could not verify your email. Try later.`,
                    });
                });
        });
    });
};

export const resetPassword = (req, res) => {
    //
};
