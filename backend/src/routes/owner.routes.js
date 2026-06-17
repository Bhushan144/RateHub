import express from 'express';
import { getOwnerDashboard, updateOwnerPassword, ownerLogout } from '../controllers/owner.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updatePasswordSchema } from '../validators/core.schema.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('STORE_OWNER'));

router.get('/dashboard', getOwnerDashboard);
router.put('/password', validate(updatePasswordSchema), updateOwnerPassword);
router.post('/logout', ownerLogout);

export default router;