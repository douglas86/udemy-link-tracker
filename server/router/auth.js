import express from 'express';

const router = express.Router();

// import validators
import { userLoginValidator, userRegisterValidator } from '../validators/auth';
import { runValidation } from '../validators';

import {
    register,
    registerActivated,
    login,
    requireSignIn,
} from '../controllers/auth';

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', registerActivated);

router.post('/login', userLoginValidator, runValidation, login);

// router.get('/secret', requireSignIn, (req, res) => {
//     res.json({
//         data: 'This is secret page for logged in users only',
//     });
// });

export default router;
