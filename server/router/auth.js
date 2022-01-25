import express from 'express';

const router = express.Router();

// import validators
import { userRegisterValidator } from '../validators/auth';
import { runValidation } from '../validators';

import { register, registerActivated } from '../controllers/auth';

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', registerActivated);

export default router;
