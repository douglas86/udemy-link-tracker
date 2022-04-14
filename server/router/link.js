import express from 'express';

const router = express.Router();

// validators
import { linkCreateValidator, linkUpdateValidator } from '../validators/link';
import { runValidation } from '../validators';

// controllers
import {
    requireSignIn,
    authMiddleWare,
    adminMiddleWare,
} from '../controllers/auth';
import {
    create,
    list,
    read,
    update,
    remove,
    clickCount,
} from '../controllers/link';

// routes
router.post(
    '/link',
    linkCreateValidator,
    runValidation,
    requireSignIn,
    authMiddleWare,
    create
);
router.post('/links', requireSignIn, adminMiddleWare, list);
router.put('/click-count', clickCount);
router.get('/link/:id', read);
router.put(
    '/link/:id',
    linkUpdateValidator,
    runValidation,
    requireSignIn,
    authMiddleWare,
    update
);
router.delete('/link/:id', requireSignIn, authMiddleWare, remove);

export default router;
