import { check } from 'express-validator';

export const userRegisterValidator = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be atleast 6 characters long'),
];

export const userLoginValidator = [
    check('email').isEmail().withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be atleast 6 characters long'),
];

export const forgetPasswordValidator = [
    check('email').isEmail().withMessage('Must be a valid email address'),
];

export const resetPasswordValidator = [
    check('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be atleast 6 characters long'),
    check('resetPasswordLink').not().isEmail().withMessage('Token is required'),
];
