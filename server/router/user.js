import express from 'express';

const router = express.Router();

// import middleware
import {
    requireSignIn,
    authMiddleWare,
    adminMiddleWare,
} from '../controllers/auth';

// import controllers
import { read } from '../controllers/user';

// routes
router.get('/user', requireSignIn, authMiddleWare, read);
router.get('/admin', requireSignIn, adminMiddleWare, read);

export default router;
