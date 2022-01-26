import express from 'express';

const router = express.Router();

// import validators
import { userLoginValidator, userRegisterValidator } from '../validators/auth';
import { runValidation } from '../validators';

import { register, registerActivated, login } from '../controllers/auth';

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', registerActivated);

router.post('/login', userLoginValidator, runValidation, login);

export default router;
