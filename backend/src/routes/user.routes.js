import express from 'express';
import { updatePassword, getStores, submitRating } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updatePasswordSchema, submitRatingSchema } from '../validators/core.schema.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Require login for all routes below
router.use(protect);

// Any logged in user can update their password
router.put('/password', validate(updatePasswordSchema), updatePassword);

// ONLY Normal Users can browse stores and submit ratings
router.use(restrictTo('NORMAL_USER'));
router.get('/stores', getStores);
router.post('/ratings', validate(submitRatingSchema), submitRating);

export default router;