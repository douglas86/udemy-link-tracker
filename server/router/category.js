import express from 'express';

const router = express.Router();

// validators
import {
    categoryCreateValidator,
    categoryUpdateValidator,
} from '../validators/category';
import { runValidation } from '../validators';

// controllers
import { requireSignIn, adminMiddleWare } from '../controllers/auth';
import { create, list, read, update, remove } from '../controllers/category';

// routes
router.post('/category', requireSignIn, adminMiddleWare, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.put(
    '/category/:slug',
    categoryUpdateValidator,
    runValidation,
    requireSignIn,
    adminMiddleWare,
    create
);
router.delete('/category/:slug', requireSignIn, adminMiddleWare, remove);

export default router;
