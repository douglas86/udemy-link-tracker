import express from 'express';

const router = express.Router();

// validators
import { linkCreateValidator, linkUpdateValidator } from '../validators/link';
import { runValidation } from '../validators';

// controllers
import { requireSignIn, authMiddleWare } from '../controllers/auth';
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
router.get('/links', list);
router.put('/click-count', clickCount);
router.get('/link/:slug', read);
router.put(
  '/link/:slug',
  linkUpdateValidator,
  runValidation,
  requireSignIn,
  authMiddleWare,
  update
);
router.delete('/link/:slug', requireSignIn, authMiddleWare, remove);

export default router;
