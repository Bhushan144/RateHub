import express from 'express';
import { updatePassword, getStores, submitRating, userLogout } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updatePasswordSchema, submitRatingSchema } from '../validators/core.schema.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.put('/password', validate(updatePasswordSchema), updatePassword);
router.post('/logout', userLogout);

router.use(restrictTo('NORMAL_USER'));
router.get('/stores', getStores);
router.post('/ratings', validate(submitRatingSchema), submitRating);

export default router;