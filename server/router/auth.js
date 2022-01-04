import express from 'express';

// import validators
import { userRegisterValidator } from '../validators/auth';
import { runValidation } from '../validators';

import { register } from '../controllers/auth';

const router = express.Router();

router.post('/register', userRegisterValidator, runValidation, register);

export default router;
